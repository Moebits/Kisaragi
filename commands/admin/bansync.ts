import {Guild, GuildMember, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Detector} from "./../../structures/Detector"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class BanSync extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Syncs the ban list of this server with another guild.",
            help:
            `
            _Note: The bot will only add bans, not remove existing bans._
            \`bansync guild name/id\` - Adds the bans from the server to this one
            `,
            examples:
            `
            \`=>bansync my other server\`
            `,
            guildOnly: true,
            aliases: [],
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        if (!await perms.checkAdmin()) return
        const embeds = new Embeds(discord, message)
        const sql = new SQLQuery(message)
        const input = Functions.combineArgs(args, 1)
        if (!input) return message.reply(`You must specify a server ${discord.getEmoji("kannaFacepalm")}`)

        let guild: Guild | undefined
        if (input.match(/\d{15,}/)) {
            guild = discord.guilds.cache.get(input.match(/\d{15,}/)?.[0] ?? "")
        } else {
            guild = discord.guilds.cache.find((g) => g.name.toLowerCase() === input.toLowerCase())
        }
        if (!guild) return message.reply(`Guild not found ${discord.getEmoji("kannaFacepalm")}`)

        try {
            const banList = await guild.fetchBans().then((e) => e.map((b) => b.user.id))
            const currList = await message.guild!.fetchBans().then((e) => e.map((b) => b.user.id))
            await Promise.all(banList.map(async (b) => {
                if (!currList.includes(b)) {
                    await message.guild?.members.ban(b)
                }
            }))
            return message.reply(`Synced this guild's ban list with **${guild.name}**! ${discord.getEmoji("aquaUp")}`)
        } catch {
            return message.reply(`I need the **Manage Server** permission in both servers, and the **Ban Members** permission in the current one. ${discord.getEmoji("kannaFacepalm")}`)
        }
    }
}
