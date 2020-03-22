import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Unblacklist extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Unblacklists a user or guild.",
            help:
            `
            \`unblacklist id\` - Unblacklists a guild (the default).
            \`unblacklist user id reason?\` Unblacklists a user. Reason is sent in dms.
            \`unblacklist guild id\` - Long form for unblacklisting guilds
            `,
            examples:
            `
            \`=>unblacklist <guild id>\`
            \`=>unblacklist user <user id>\`
            `,
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        const sql = new SQLQuery(message)
        const embeds = new Embeds(discord, message)
        if (!perms.checkBotDev()) return
        const blacklistEmbed = embeds.createEmbed()
        blacklistEmbed
        .setAuthor("unblacklist", "https://cdn.discordapp.com/emojis/685492185235325005.png")
        .setTitle(`**Unblacklist** ${discord.getEmoji("tohruSmug")}`)
        let setGuild = true
        if (args[1] === "user") {
            args.shift()
            setGuild = false
        } else if (args[1] === "guild") {
            args.shift()
        }
        const id = args[1]
        const reason = Functions.combineArgs(args, 2) ? Functions.combineArgs(args, 2) : null
        if (!id) return message.reply("Who do you want to unblacklist...")
        if (setGuild) {
            const exists = await sql.fetchColumn("blacklist", "guild id", "guild id", id)
            if (exists) {
                await SQLQuery.deleteRow("blacklist", "guild id", id)
                return message.reply(blacklistEmbed.setDescription(`Unblacklisted the guild **${id}**!`))
            } else {
                return message.reply("This guild isn't blacklisted...")
            }
        } else {
            const exists = await sql.fetchColumn("blacklist", "user id", "user id", id)
            if (exists) {
                const user = await discord.users.fetch(id)
                await SQLQuery.deleteRow("blacklist", "user id", id)
                await user?.send(blacklistEmbed.setDescription(`You were unblacklisted from Kisaragi Bot. Message from developer: **${reason ?? "None provided!"}**. Whatever you were blacklisted for, don't continue doing it.`))
                return message.reply(blacklistEmbed.setDescription(`Unblacklisted the user **${user!.tag}**`))
            } else {
                return message.reply("This user isn't blacklisted...")
            }
        }
    }
}
