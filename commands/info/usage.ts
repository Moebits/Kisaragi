import {Guild, Message, EmbedBuilder, User} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Kisaragi} from "../../structures/Kisaragi"
import {SQLQuery} from "../../structures/SQLQuery"
import {CommandFunctions} from "./../../structures/CommandFunctions"
import {Functions} from "./../../structures/Functions"
import {Permission} from "./../../structures/Permission"

export default class Usage extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Get the usage statistics of a command, guild, or user.",
            help:
            `
            \`usage\` - Usage for all commands
            \`usage command\` - Gets the usage of a command
            \`usage guild id/name command?\` - Gets the usage of a guild
            \`usage user id/tag command?\` - Gets the usage of a user
            \`usage me command?\` - Gets your usage
            \`usage guild/server command?\` - Gets the usage of the current guild
            \`usage guild list\` - Usage for all guilds (Bot developer only)
            \`usage user list\` - Usage for all users (Bot developer only)
            `,
            examples:
            `
            \`=>usage help\`
            \`=>usage user#6969\`
            \`=>usage guild list\`
            `,
            guildOnly: true,
            aliases: ["activity"],
            random: "none",
            cooldown: 5,
            nsfw: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        const sql = new SQLQuery(message)
        const cmd = new CommandFunctions(discord, message)

        if (!args[1]) {
            const commands = await SQLQuery.selectColumn("commands", "command")
            const rawUsage: string[] = []
            for (let i = 0; i < commands.length; i++) {
                const cmd = await sql.fetchColumn("commands", "usage", "command", commands[i])
                rawUsage.push(cmd)
            }
            const usage = Functions.sortObject(Functions.doubleObjectArray(commands, rawUsage))
            let description = ""
            for (let i = 0; i < Object.keys(usage).length; i++) {
                description += `${discord.getEmoji("star")}_${Object.keys(usage)[i]}:_ **${Object.values(usage)[i] ?? 0}** uses\n`
            }
            const splits = Functions.splitMessage(description, {maxLength: 1800, char: "\n"})
            const usageArray: EmbedBuilder[] = []
            for (let i = 0; i < splits.length; i++) {
                const usageEmbed = embeds.createEmbed()
                .setAuthor({name: "usage", iconURL: "https://cdn4.iconfinder.com/data/icons/web-hosting-2-2/32/CPU_Activity-512.png"})
                .setTitle(`**Command Usage Statistics** ${discord.getEmoji("raphi")}`)
                .setThumbnail(message.author.displayAvatarURL({extension: "png"}))
                .setDescription(splits[i])
                usageArray.push(usageEmbed)
            }

            if (usageArray.length === 1) {
                message.channel.send({embeds: [usageArray[0]]})
            } else {
                embeds.createReactionEmbed(usageArray)
            }
            return
        }

        if (args[2] === "list") {
            if (!perms.checkBotDev()) return
            let description = ""
            let titleText = ""
            if (args[1] === "guild") {
                const guilds = await SQLQuery.selectColumn("guilds", "guild id")
                const rawUsage: string[] = []
                for (let i = 0; i < guilds.length; i++) {
                    const raw = await sql.fetchColumn("guilds", "usage", "guild id", guilds[i])
                    rawUsage.push(raw)
                }
                if (!rawUsage) return message.reply(`No usage data available ${discord.getEmoji("kannaFacepalm")}`)
                const usage = Functions.sortObject(Functions.doubleObjectArray(guilds, rawUsage, "total"))
                titleText = `**Guild Usage Statistics** ${discord.getEmoji("raphi")}`
                for (let i = 0; i < Object.keys(usage).length; i++) {
                    const name = discord.guilds.cache.get(Object.keys(usage)[i])?.name
                    if (!name) continue
                    if (Object.keys(usage)[i] === "total") Object.keys(usage)[i] = "Total"
                    description += `${name} \`(${Object.keys(usage)[i]})\`: **${Object.values(usage)[i] ?? 0}** uses\n`
                }
            } else if (args[1] === "user") {
                const users = await SQLQuery.selectColumn("misc", "user id")
                const rawUsage: string[] = []
                for (let i = 0; i < users.length; i++) {
                    const raw = await sql.fetchColumn("misc", "usage", "user id", users[i])
                    rawUsage.push(raw)
                }
                if (!rawUsage) return message.reply(`No usage data available ${discord.getEmoji("kannaFacepalm")}`)
                const usage = Functions.sortObject(Functions.doubleObjectArray(users, rawUsage, "total"))
                titleText = `**User Usage Statistics** ${discord.getEmoji("raphi")}`
                for (let i = 0; i < Object.keys(usage).length; i++) {
                    const name = discord.users.cache.get(Object.keys(usage)[i])?.tag
                    if (!name) continue
                    if (Object.keys(usage)[i] === "total") Object.keys(usage)[i] = "Total"
                    description += `${name} \`(${Object.keys(usage)[i]})\`: **${Object.values(usage)[i] ?? 0}** uses\n`
                }
            }
            const splits = Functions.splitMessage(description, {maxLength: 1800, char: "\n"})
            const usageArray: EmbedBuilder[] = []
            for (let i = 0; i < splits.length; i++) {
                const usageEmbed = embeds.createEmbed()
                .setAuthor({name: "usage", iconURL: "https://cdn4.iconfinder.com/data/icons/web-hosting-2-2/32/CPU_Activity-512.png"})
                .setTitle(titleText)
                .setThumbnail(message.author.displayAvatarURL({extension: "png"}))
                .setDescription(splits[i])
                usageArray.push(usageEmbed)
            }

            if (usageArray.length === 1) {
                message.channel.send({embeds: [usageArray[0]]})
            } else {
                embeds.createReactionEmbed(usageArray)
            }
            return
        }

        if (args[1].match(/\d{4,}/) || args[1] === "me" || args[1] === "guild" || args[1] === "server") {
            let user: User | undefined
            let guild: Guild | null | undefined
            if (args[1] === "me") user = message.author
            if (args[1] === "guild" || args[1] === "server") guild = message.guild
            if (args[1].includes("#")) {
                user = discord.users.cache.find((u) => u.tag.toLowerCase() === args[1].toLowerCase())
                if (!user) return message.reply(`Invalid user ${discord.getEmoji("kannaFacepalm")}`)
            } else if (args[1].match(/\d+/)) {
                user = discord.users.cache.get(args[1])
                guild = discord.guilds.cache.get(args[1])
            }

            let usage: any
            let titleText = ""
            if (user) {
                usage = await sql.fetchColumn("misc", "usage", "user id", user.id)
                titleText = `**User Usage Statistics** ${discord.getEmoji("raphi")}`
            }
            if (guild) {
                usage = await sql.fetchColumn("guilds", "usage", "guild id", guild.id)
                titleText = `**Guild Usage Statistics** ${discord.getEmoji("raphi")}`
            }
            if (!usage) return message.reply(`There is no usage data available ${discord.getEmoji("kannaFacepalm")}`)
            usage = Functions.sortObject(JSON.parse(usage))

            if (args[2]) {
                if (!usage[args[2]]) return message.reply(`No usage data for this command ${discord.getEmoji("kannaFacepalm")}`)
                const usageEmbed = embeds.createEmbed()
                .setAuthor({name: "usage", iconURL: "https://cdn4.iconfinder.com/data/icons/web-hosting-2-2/32/CPU_Activity-512.png"})
                .setTitle(titleText)
                .setThumbnail(message.author.displayAvatarURL({extension: "png"}))
                .setDescription(
                    `${discord.getEmoji("star")}The command **${args[2]}** has been used **${usage[args[2]]}** times!\n`
                )
                return message.channel.send({embeds: [usageEmbed]})
            }
            let description = ""
            for (let i = 0; i < Object.keys(usage).length; i++) {
                if (Object.keys(usage)[i] === "total") Object.keys(usage)[i] = "Total"
                description += `${discord.getEmoji("star")}_${Object.keys(usage)[i]}:_ **${Object.values(usage)[i] ?? 0}** uses\n`
            }
            const splits = Functions.splitMessage(description, {maxLength: 1800, char: "\n"})
            const usageArray: EmbedBuilder[] = []
            for (let i = 0; i < splits.length; i++) {
                const usageEmbed = embeds.createEmbed()
                .setAuthor({name: "usage", iconURL: "https://cdn4.iconfinder.com/data/icons/web-hosting-2-2/32/CPU_Activity-512.png"})
                .setTitle(titleText)
                .setThumbnail(message.author.displayAvatarURL({extension: "png"}))
                .setDescription(splits[i])
                usageArray.push(usageEmbed)
            }

            if (usageArray.length === 1) {
                message.channel.send({embeds: [usageArray[0]]})
            } else {
                embeds.createReactionEmbed(usageArray)
            }
            return
        }

        const cmdPath = await cmd.findCommand(args[1])
        if (!cmdPath) return message.reply(`Invalid command ${discord.getEmoji("kannaFacepalm")}`)
        let usage = await sql.fetchColumn("commands", "usage", "path", cmdPath)
        const command = await sql.fetchColumn("commands", "command", "path", cmdPath)
        if (!usage) usage = 0

        const usageEmbed = embeds.createEmbed()
        .setAuthor({name: "usage", iconURL: "https://cdn4.iconfinder.com/data/icons/web-hosting-2-2/32/CPU_Activity-512.png"})
        .setTitle(`**Command Usage Statistics** ${discord.getEmoji("raphi")}`)
        .setThumbnail(message.author.displayAvatarURL({extension: "png"}))
        .setDescription(
            `${discord.getEmoji("star")}The command **${command}** has been used **${usage}** times!\n`
        )
        return message.channel.send({embeds: [usageEmbed]})
    }
}
