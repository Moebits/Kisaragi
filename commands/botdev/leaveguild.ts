import {Guild, Message, TextChannel} from "discord.js"
import {SlashCommandOption} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {SQLQuery} from "../../structures/SQLQuery"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"

export default class LeaveGuild extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Forcefully leaves a guild.",
            aliases: ["lg"],
            cooldown: 10,
            botdev: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const sql = new SQLQuery(message)
        const perms = new Permission(discord, message)
        if (!perms.checkBotDev()) return

        let guildID: string
        let silent = false
        if (args[1] === "silent") {
            guildID = args[2]
            silent = true
        } else {
            guildID = args[1]
        }
        const reason = Functions.combineArgs(args, 2)
        const guild = discord.guilds.cache.find((g: Guild) => g.id.toString() === guildID) as Guild
        if (!guild) return message.reply(`Not in this server ${discord.getEmoji("kannaFacepalm")}`)
        const name = guild.name

        if (!silent) {
            const msg = await discord.fetchFirstMessage(guild)
            await (msg?.channel as TextChannel).send(`I am leaving this guild. Message from bot developer: **${reason ? reason : "None provided!"}**`)
        }

        await guild.leave()
        await SQLQuery.deleteGuild(guildID)
        await message.channel.send(`Left the guild **${name}**!`)
    }
}
