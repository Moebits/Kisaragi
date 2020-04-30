import {DMChannel, Message, MessageEmbed, TextChannel, User, Webhook} from "discord.js"
import {Embeds} from "./../structures/Embeds"
import {Functions} from "./../structures/Functions"
import {Kisaragi} from "./../structures/Kisaragi"
import {SQLQuery} from "./../structures/SQLQuery"

export default class CaseUpdate {
    constructor(private readonly discord: Kisaragi) {}

    public update = async (sql: SQLQuery, embed: MessageEmbed, instance: any) => {
        const discord = this.discord
        const user = await discord.users.fetch(instance.user)
        const executor = await discord.users.fetch(instance.executor)
        let cases = await sql.fetchColumn("warns", "cases")
        if (!cases) cases = []
        const modLogID =  await sql.fetchColumn("logs", "mod log")
        const modLog = discord.channels.cache.get(modLogID ?? "") as TextChannel
        const caseNumber = cases.length + 1
        embed
        .setThumbnail(user.displayAvatarURL({format: "png", dynamic: true}))
        .setDescription(
            `${discord.getEmoji("star")}_User:_ **${user.tag}** \`(${user.id})\`\n` +
            `${discord.getEmoji("star")}_Moderator:_ **${executor.tag}** \`(${executor.id})\`\n` +
            `${discord.getEmoji("star")}_Reason:_ ${instance.reason}\n`
        )
        .setFooter(`Case #${caseNumber} • ${Functions.formatDate(new Date())}`, executor.displayAvatarURL({format: "png", dynamic: true}))
        const msg = await modLog?.send(embed).then((m) => m.id).catch(() => null)
        const data = {...instance, case: caseNumber, message: msg}
        cases.push(data)
        await sql.updateColumn("warns", "cases", cases)
        return
    }

    public run = async (instance: any) => {
        const discord = this.discord
        const guild = discord.guilds.cache.find((g) => g.id === instance.guild)
        if (!guild) return
        const message = await discord.fetchFirstMessage(guild)
        if (!message) return
        const sql = new SQLQuery(message)
        const embeds = new Embeds(discord, message)
        switch (instance.type) {
            case "warn":
                const warnEmbed = embeds.createEmbed()
                warnEmbed
                .setAuthor("warn", "https://www.emoji.co.uk/files/phantom-open-emojis/symbols-phantom/13025-warning-sign.png")
                .setTitle(`**Member Warned** ${discord.getEmoji("raphi")}`)
                await this.update(sql, warnEmbed, instance)
                break
            case "ban":
                const banEmbed = embeds.createEmbed()
                banEmbed
                .setAuthor("ban", "https://discordemoji.com/assets/emoji/bancat.png")
                .setTitle(`**Member Banned** ${discord.getEmoji("kannaFU")}`)
                await this.update(sql, banEmbed, instance)
                break
            case "unban":
                const unbanEmbed = embeds.createEmbed()
                unbanEmbed
                .setAuthor("unban", "https://discordemoji.com/assets/emoji/bancat.png")
                .setTitle(`**Member Unbanned** ${discord.getEmoji("ceaseBullying")}`)
                await this.update(sql, unbanEmbed, instance)
            case "kick":
                const kickEmbed = embeds.createEmbed()
                kickEmbed
                .setAuthor("kick", "https://discordemoji.com/assets/emoji/4331_UmaruWave.png")
                .setTitle(`**Member Kicked** ${discord.getEmoji("kannaFU")}`)
                await this.update(sql, kickEmbed, instance)
            default:
        }

    }

}
