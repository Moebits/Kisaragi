import {Guild, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {SQLQuery} from "../../structures/SQLQuery"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class DeleteGuild extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Deletes a guild (created by the bot).",
            aliases: ["dg"],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const sql = new SQLQuery(message)
        const perms = new Permission(discord, message)
        if (!perms.checkBotDev()) return

        const guildID = args[1]
        const guild = discord.guilds.cache.find((g: Guild) => g.id.toString() === guildID) as Guild
        const name = guild.name

        try {
            guild.delete()
        } catch (err) {
            console.log(err)
        } finally {
            await SQLQuery.deleteGuild(guildID)
        }

        message.channel.send(`Deleted the guild **${name}**!`)
    }
}
