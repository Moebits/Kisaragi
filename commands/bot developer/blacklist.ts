import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Clean extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Blacklists a user or entire guild so that they cannot use Kisaragi.",
            help:
            `
            \`blacklist id reason?\` - Blacklists a guild (the default).
            \`blacklist user id reason?\` Blacklists a user.
            \`blacklist guild id reason?\` - Long form for blacklisting guilds
            `,
            examples:
            `
            \`=>blacklist <guild id>\`
            \`=>blacklist user <user id>\`
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
        .setAuthor("blacklist", "https://cdn.discordapp.com/emojis/585923517699325953.png")
        .setTitle(`**Blacklist** ${discord.getEmoji("smugFace")}`)
        let setGuild = true
        if (args[1] === "user") {
            args.shift()
            setGuild = false
        } else if (args[1] === "guild") {
            args.shift()
        }
        const id = args[1]
        const reason = Functions.combineArgs(args, 2) ? Functions.combineArgs(args, 2) : null
        if (!id) return message.reply("Who do you want to blacklist...")
        if (setGuild) {
            const exists = await sql.fetchColumn("blacklist", "guild id", "guild id", id)
            if (exists) {
                return message.reply("Guild is already blacklisted!")
            } else {
                const guild = discord.guilds.cache.get(id)
                if (!guild) return message.reply("Invalid guild id!")
                await sql.insertInto("blacklist", "guild id", id)
                const msg = await discord.fetchFirstMessage(guild)
                if (msg) await msg.channel.send(blacklistEmbed.setDescription(`Your guild has been blacklisted, and you will no longer be able to add me onto it. Message from developer: **${reason ?? "None provided!"}**`))
                await guild.leave()
                return message.channel.send(blacklistEmbed.setDescription(`Blacklisted the guild **${guild.name}**!`))
            }
        } else {
            const exists = await sql.fetchColumn("blacklist", "user id", "user id", id)
            if (exists) {
                return message.reply("User is already blacklisted!")
            } else {
                const user = discord.users.cache.get(id)
                if (!user) return message.reply("Invalid user id!")
                await sql.insertInto("blacklist", "user id", id)
                await user.send(blacklistEmbed.setDescription(`You have been blacklisted, and you will no longer be able use Kisaragi bot. Message from developer: **${reason ?? "None provided!"}**`))
                return message.channel.send(blacklistEmbed.setDescription(`Blacklisted the user **${user.tag}**!`))
            }
        }
    }
}
