import {Client, ClientOptions, Collection, Guild, GuildChannel, GuildEmoji, Message, TextChannel} from "discord.js"
import {Embeds} from "./Embeds"

export class Kisaragi extends Client {
    constructor(options: ClientOptions) {
        super(options)
    }

    // Get Emoji
    public getEmoji = (name: string): GuildEmoji => {
        const emoji = this.emojis.cache.find((e) => (e.name === name) && (e.guild.ownerID === process.env.OWNER_ID))
        if (emoji) {
            return emoji as unknown as GuildEmoji
        } else {
            // Confused Anime
            return this.emojis.cache.get("579870079311937557") as unknown as GuildEmoji
        }
    }

    // Fetch Message
    public fetchMessage = async (msg: Message, messageID: string) => {
        const channels = msg.guild!.channels.cache.map((c: GuildChannel) => {if (c.type === "text") return c as TextChannel})
        const msgArray: Message[] = []
        for (let i = 0; i < channels.length; i++) {
            const found = await channels[i]!.messages.fetch({limit: 1, around: messageID})
            if (found) msgArray.push(found.first() as Message)
        }
        const msgFound = msgArray.find((m: Message) => m.id === messageID)
        return msgFound
    }

    // Get an Invite
    public getInvite = async (guild: Guild | null) => {
        if (!guild) return "None"
        const invites = await guild.fetchInvites()
        let invite
        if (invites) {
            invite = invites.find((i)=>i.temporary === false)?.url
            if (!invite) invite = invites.first()?.url
        }
        if (!invite) invite = "None"
        return invite
    }

    // Fetch First Message in a Guild
    public fetchFirstMessage = async (guild: Guild) => {
        const channels = guild.channels.cache.filter((c: GuildChannel) => c.type === "text")
        const channel = channels.first() as TextChannel
        const lastMsg = await channel.messages.fetch({limit: 1}).then((c: Collection<string, Message>) => c.first())
        return lastMsg
    }

    // Check for Bot Mention
    public checkBotMention = (message: Message) => {
        if (message.author!.id === this.user!.id) return false
        if (message.content.startsWith(this.user!.id)) return true
    }

    // Errors
    public cmdError = (msg: Message, error: Error) => {
        const embeds = new Embeds(this, msg)
        console.log(error)
        const messageErrorEmbed = embeds.createEmbed()
        messageErrorEmbed
        .setTitle(`**Command Error** ${this.getEmoji("maikaWut")}`)
        .setDescription(`There was an error executing this command:\n` +
        `**${error.name}: ${error.message}**\n` + `Please report this through the following links:\n` +
        `[Support Server](https://discord.gg/77yGmWM), [Github Repository](https://github.com/Tenpi/Kisaragi)`)
        return messageErrorEmbed
    }

}
