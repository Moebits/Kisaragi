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
                    await modChannel.send(`I need the **View Audit Logs** permission in order to log guild bans.`).catch(() => null)
                    return
                }) as GuildAuditLogsEntry
                if (!log) return
                const data = {type: "ban", user: (log.target as User).id, executor: log.executor.id, date: Date.now(), guild: guild.id, reason: log.reason}
                discord.emit("caseUpdate", data)
            }
        }
        logBan(guild, user)
    }
}
