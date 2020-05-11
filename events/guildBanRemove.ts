import {Guild, GuildAuditLogsEntry, Message, TextChannel, User} from "discord.js"
import {Embeds} from "./../structures/Embeds"
import {Functions} from "./../structures/Functions"
import {Kisaragi} from "./../structures/Kisaragi"
import {SQLQuery} from "./../structures/SQLQuery"
export default class GuildBanRemove {
    constructor(private readonly discord: Kisaragi) {}

    public run = async (guild: Guild, user: User) => {
        const discord = this.discord
        const message = await discord.fetchFirstMessage(guild)
        if (!message) return
        const sql = new SQLQuery(message)
        const embeds = new Embeds(discord, message)

        const logUnban = async (guild: Guild, user: User) => {
            const modLog = await sql.fetchColumn("guilds", "mod log")
            if (modLog) {
                const modChannel = guild?.channels.cache.get(modLog)! as TextChannel
                const log = await guild.fetchAuditLogs({type: "MEMBER_BAN_REMOVE", limit: 1}).then((l) => l.entries.first())
                .catch(async () => {
                    await modChannel.send(`I need the **View Audit Logs** permission in order to log guild bans.`).catch(() => null)
                    return
                }) as GuildAuditLogsEntry
                if (!log) return
                const data = {type: "unban", user: (log.target as User).id, executor: log.executor.id, date: Date.now(), guild: guild.id, reason: log.reason}
                discord.emit("caseUpdate", data)
            }
        }
        logUnban(guild, user)
    }
}
