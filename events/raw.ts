import {Guild, GuildEmoji, MessageReaction, TextChannel} from "discord.js"
import {Kisaragi} from "./../structures/Kisaragi"
import {SQLQuery} from "./../structures/SQLQuery"

const events = {
    MESSAGE_REACTION_ADD: "messageReactionAdd",
    MESSAGE_REACTION_REMOVE: "messageReactionRemove"
} as any

export default class Raw {
    constructor(private readonly discord: Kisaragi) {}

    public run = async (event: any) => {
        if (!events.hasOwnProperty(event.t)) return
        const {d: data} = event
        const user = this.discord.users.cache.get(data.user_id)
        const channel = (this.discord.channels.cache.get(data.channel_id) || await user!.createDM()) as TextChannel
        const message = await channel.messages.fetch(data.message_id)
        const sql = new SQLQuery(message)

        if (channel.messages.cache.has(data.message_id)) return

        await sql.insertInto("ignore", "message", data.message_id)
        const emojiKey = data.emoji.id || data.emoji.name
        let reaction = message.reactions.cache.get(emojiKey)

        if (!reaction) {
        const emoji = new GuildEmoji(this.discord, data.emoji, this.discord.guilds.cache.get(data.guild_id) as Guild)
        reaction = new MessageReaction(this.discord, emoji, message)
    }
        this.discord.emit(events[event.t], reaction, user)
    }
}
