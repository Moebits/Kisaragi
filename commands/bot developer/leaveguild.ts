import {Guild, Message, TextChannel} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {SQLQuery} from "../../structures/SQLQuery"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class LeaveGuild extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Leaves a guild.",
            aliases: ["lg"],
            cooldown: 10
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

        const msg = await discord.fetchFirstMessage(guild)
        await (msg?.channel as TextChannel).send(`I am leaving this guild at the request of the bot developer.`)

        try {
            guild.leave()
        } catch (err) {
            console.log(err)
        } finally {
            await sql.deleteGuild(guildID)
        }

        message.channel.send(`Left the guild **${name}**!`)
    }
}
