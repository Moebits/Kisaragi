import {Guild, GuildAuditLogsEntry, GuildMember, Message, MessageAttachment, TextChannel, User} from "discord.js"
import {Embeds} from "./../structures/Embeds"
import {Functions} from "./../structures/Functions"
import {Images} from "./../structures/Images"
import {Kisaragi} from "./../structures/Kisaragi"
import {SQLQuery} from "./../structures/SQLQuery"

export default class GuildMemberRemove {
    constructor(private readonly discord: Kisaragi) {}

    public run = async (member: GuildMember) => {
        const discord = this.discord
        const firstMsg = await this.discord.fetchFirstMessage(member.guild) as Message
        const sql = new SQLQuery(firstMsg)
        if (member.guild.me?.permissions.has("MANAGE_GUILD")) {
            const bans = await member.guild.fetchBans()
            if (bans.has(member.id)) return
        }

        let defaultChannel = firstMsg.channel as TextChannel
        const defChannel = await sql.fetchColumn("blocks", "default channel")
        if (defChannel) {
            defaultChannel = this.discord.channels.cache.find((c) => c.id.toString() === String(defChannel)) as TextChannel
        }

        const defMsg = defaultChannel ? await defaultChannel.messages.fetch({limit: 1}).then((m) => m.first()) as Message :
        await this.discord.fetchFirstMessage(member.guild) as Message

        const image = new Images(this.discord, defMsg)
        const embeds = new Embeds(this.discord, defMsg)

        const leaveMessages = async () => {
            const leaveToggle = await sql.fetchColumn("welcome leaves", "leave toggle")
            if (!(leaveToggle === "on")) return

            const leaveMsg = await sql.fetchColumn("welcome leaves", "leave message")
            const leaveChannel = await sql.fetchColumn("welcome leaves", "leave channel")
            const leaveImage = await sql.fetchColumn("welcome leaves", "leave bg image")
            const leaveText = await sql.fetchColumn("welcome leaves", "leave bg text")
            const leaveColor = await sql.fetchColumn("welcome leaves", "leave bg color")
            const channel = member.guild.channels.cache.find((c) => c.id.toString() === String(leaveChannel)) as TextChannel

            const attachment = await image.createCanvas(member, String(leaveImage), String(leaveText), String(leaveColor)) as MessageAttachment

            const newMsg = String(leaveMsg).replace(/user/g, `<@${member.user.id}>`).replace(/guild/g, member.guild.name)
            .replace(/tag/g, member.user.tag).replace(/name/g, member.displayName).replace(/count/g, member.guild.memberCount.toString())

            channel.send(newMsg, attachment)
        }

        leaveMessages()

        const leaveBan = async (discord: Kisaragi) => {
            const leaveBanToggle = await sql.fetchColumn("blocks", "leaver ban toggle")
            const banEmbed = embeds.createEmbed()
            if (!(leaveBanToggle === "on")) return

            const now = Math.ceil(Date.now())
            const joinDate = member.joinedTimestamp!
            if ((now - joinDate) <= 300000) {
                const channel = defaultChannel
                const reason = "Joining and leaving in under 5 minutes."
                banEmbed
                .setAuthor("ban", "https://discordemoji.com/assets/emoji/bancat.png")
                .setTitle(`**Member Banned** ${discord.getEmoji("kannaFU")}`)
                .setDescription(`${discord.getEmoji("star")}_Successfully banned <@${member.user.id}> for reason:_ **${reason}**`)
                if (channel) channel.send(banEmbed)
                banEmbed
                .setTitle(`**You Were Banned** ${discord.getEmoji("kannaFU")}`)
                .setDescription(`${discord.getEmoji("star")}_You were banned from ${member.guild.name} for reason:_ **${reason}**`)
                await member.ban({reason})
            }
        }
        leaveBan(this.discord)

        const logKick = async (member: GuildMember) => {
            const modLog = await sql.fetchColumn("logs", "mod log")
            if (modLog) {
                const modChannel = member.guild?.channels.cache.get(modLog)! as TextChannel
                const log = await member.guild.fetchAuditLogs({type: "MEMBER_KICK", limit: 1}).then((l) => l.entries.first())
                .catch(async () => {
                    return modChannel.send(`I need the **View Audit Logs** permission in order to log guild bans.`).catch(() => null)
                }) as GuildAuditLogsEntry
                if (member.id !== (log?.target as User).id) return
                const target = log?.target ? `**${(log.target as User).tag}** \`(${(log.target as User).id})\`` : "Unknown"
                const executor = log?.executor ? `**${log.executor.tag}** \`(${log.executor.id})\`` : "Unknown"
                const kickEmbed = embeds.createEmbed()
                kickEmbed
                .setAuthor("kick", "https://discordemoji.com/assets/emoji/4331_UmaruWave.png")
                .setTitle(`**Member Kicked** ${discord.getEmoji("kannaFU")}`)
                .setThumbnail((log?.target as User)?.displayAvatarURL({format: "png", dynamic: true}) ?? "")
                .setDescription(
                    `${discord.getEmoji("star")}_Target:_ ${target}\n` +
                    `${discord.getEmoji("star")}_Executor:_ ${executor}\n` +
                    `${discord.getEmoji("star")}_Audit Log ID:_ \`${log?.id ?? "Unknown"}\`\n` +
                    `${discord.getEmoji("star")}_Reason:_ ${log?.reason ?? "Unknown"}\n`
                )
                .setFooter(`${member.guild.name} • ${Functions.formatDate(log?.createdAt ?? new Date())}`, member.guild.iconURL({format: "png", dynamic: true}) ?? "")
                await modChannel.send(kickEmbed).catch(() => null)
            }
        }
        logKick(member)

        const logLeave = async (member: GuildMember) => {
            const userLog = await sql.fetchColumn("logs", "user log")
            if (userLog) {
                const leaveChannel = member.guild?.channels.cache.get(userLog)! as TextChannel
                const leaveEmbed = embeds.createEmbed()
                leaveEmbed
                .setAuthor("leave", "https://cdn.discordapp.com/emojis/593279118393475073.gif")
                .setTitle(`**Member Left** ${discord.getEmoji("sagiriBleh")}`)
                .setThumbnail(member.user.displayAvatarURL({format: "png", dynamic: true}))
                .setDescription(
                    `${discord.getEmoji("star")}_Member:_ **<@!${member.id}> (${member.user.tag})**\n` +
                    `${discord.getEmoji("star")}_Member ID:_ \`${member.id}\`\n` +
                    `${discord.getEmoji("star")}_Bot Account:_ **${member.user.bot ? "Yes" : "No"}**\n` +
                    `${discord.getEmoji("star")}_Account Creation Date:_ **${Functions.formatDate(member.user.createdAt)}**\n` +
                    `${discord.getEmoji("star")}_Guild Members:_ **${member.guild.members.cache.size}**\n`
                )
                .setFooter(`${member.guild.name} • ${Functions.formatDate(member.joinedAt ?? new Date())}`, member.guild.iconURL({format: "png", dynamic: true}) ?? "")
                await leaveChannel.send(leaveEmbed).catch(() => null)
            }
        }
        logLeave(member)
    }
}
