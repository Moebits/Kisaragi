import {Guild, GuildAuditLogsEntry, Message, TextChannel, User} from "discord.js"
import {Embeds} from "./../structures/Embeds"
import {Functions} from "./../structures/Functions"
import {Kisaragi} from "./../structures/Kisaragi"
import {SQLQuery} from "./../structures/SQLQuery"
export default class GuildBanAdd {
    constructor(private readonly discord: Kisaragi) {}

    public run = async (guild: Guild, user: User) => {
        const discord = this.discord
        const message = await discord.fetchFirstMessage(guild)
        const sql = new SQLQuery(message!)
        const embeds = new Embeds(discord, message!)

        const logBan = async (guild: Guild, user: User) => {
            const modLog = await sql.fetchColumn("logs", "mod log")
            if (modLog) {
                const modChannel = guild?.channels.cache.get(modLog)! as TextChannel
                const log = await guild.fetchAuditLogs({type: "MEMBER_BAN_ADD", limit: 1}).then((l) => l.entries.first())
                .catch(async () => {
                    return modChannel.send(`I need the **View Audit Logs** permission in order to log guild bans.`).catch(() => null)
                }) as GuildAuditLogsEntry
                const target = log?.target ? `**${(log.target as User).tag}** \`(${(log.target as User).id})\`` : "Unknown"
                const executor = log?.executor ? `**${log.executor.tag}** \`(${log.executor.id})\`` : "Unknown"
                const banEmbed = embeds.createEmbed()
                banEmbed
                .setAuthor("ban", "https://discordemoji.com/assets/emoji/bancat.png")
                .setTitle(`**Member Banned** ${discord.getEmoji("kannaFU")}`)
                .setThumbnail((log?.target as User)?.displayAvatarURL({format: "png", dynamic: true}) ?? "")
                .setDescription(
                    `${discord.getEmoji("star")}_Target:_ ${target}\n` +
                    `${discord.getEmoji("star")}_Executor:_ ${executor}\n` +
                    `${discord.getEmoji("star")}_Audit Log ID:_ \`${log?.id ?? "Unknown"}\`\n` +
                    `${discord.getEmoji("star")}_Reason:_ ${log?.reason ?? "Unknown"}\n`
                )
                .setFooter(`${guild.name} • ${Functions.formatDate(log?.createdAt ?? new Date())}`, guild.iconURL({format: "png", dynamic: true}) ?? "")
                await modChannel.send(banEmbed).catch(() => null)
            }
        }
        logBan(guild, user)
    }
}
