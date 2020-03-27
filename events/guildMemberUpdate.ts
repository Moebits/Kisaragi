import {Guild, GuildAuditLogsEntry, GuildMember, Message, Role, TextChannel, User} from "discord.js"
import {Embeds} from "./../structures/Embeds"
import {Functions} from "./../structures/Functions"
import {Kisaragi} from "./../structures/Kisaragi"
import {SQLQuery} from "./../structures/SQLQuery"
export default class GuildMemberUpdate {
    constructor(private readonly discord: Kisaragi) {}

    public run = async (oldMember: GuildMember, newMember: GuildMember) => {
        const discord = this.discord
        const message = await discord.fetchFirstMessage(newMember.guild)
        const sql = new SQLQuery(message!)
        const embeds = new Embeds(discord, message!)

        let [setNick, setNewRole, setRemoveRole] = [false, false, false]

        if (oldMember.nickname !== newMember.nickname) setNick = true
        if (oldMember.roles.cache.size < newMember.roles.cache.size) setNewRole = true
        if (oldMember.roles.cache.size > newMember.roles.cache.size) setRemoveRole = true

        const logNick = async (oldMember: GuildMember, newMember: GuildMember) => {
            const memberLog = await sql.fetchColumn("logs", "member log")
            if (memberLog) {
                const memberChannel = newMember.guild?.channels.cache.get(memberLog)! as TextChannel
                const logEmbed = embeds.createEmbed()
                logEmbed
                .setAuthor("nickname", "https://cdn.discordapp.com/emojis/589154620845195275.png")
                .setTitle(`**Nickname Change** ${discord.getEmoji("chinoSmug")}`)
                .setThumbnail(newMember.user.displayAvatarURL({format: "png", dynamic: true}) ?? "")
                .setDescription(
                    `${discord.getEmoji("star")}_User:_ **<@!${newMember.id}> (${newMember.user.tag})**\n` +
                    `${discord.getEmoji("star")}_User ID:_ \`${newMember.id}\`\n` +
                    `${discord.getEmoji("star")}_Old Nickname:_ **${oldMember.nickname ?? oldMember.displayName}**\n` +
                    `${discord.getEmoji("star")}_New Nickname:_ **${newMember.nickname ?? newMember.displayName}**\n`
                )
                .setFooter(`${newMember.guild.name} • ${Functions.formatDate(new Date())}`, newMember.guild.iconURL({format: "png", dynamic: true}) ?? "")
                await memberChannel.send(logEmbed).catch(() => null)
            }
        }
        if (setNick) logNick(oldMember, newMember)

        const logNewRole = async (oldMember: GuildMember, newMember: GuildMember) => {
            const memberLog = await sql.fetchColumn("logs", "member log")
            if (memberLog) {
                const newRole = newMember.roles.cache.find((r) => {
                    if (oldMember.roles.cache.has(r.id)) {
                        return false
                    } else {
                        return true
                    }
                }) as Role
                const memberChannel = newMember.guild?.channels.cache.get(memberLog)! as TextChannel
                const logEmbed = embeds.createEmbed()
                logEmbed
                .setAuthor("new role", "https://cdn.discordapp.com/emojis/682967153200070690.png")
                .setTitle(`**Role Addition** ${discord.getEmoji("tohruThink")}`)
                .setThumbnail(newMember.user.displayAvatarURL({format: "png", dynamic: true}))
                .setDescription(
                    `${discord.getEmoji("star")}_User:_ **<@!${newMember.id}> (${newMember.user.tag})**\n` +
                    `${discord.getEmoji("star")}_User ID:_ \`${newMember.id}\`\n` +
                    `${discord.getEmoji("star")}_New Role:_ <@&${newRole.id}>\n` +
                    `${discord.getEmoji("star")}_Roles:_ **${newMember.roles.cache.size - 1}**`
                )
                .setFooter(`${newMember.guild.name} • ${Functions.formatDate(new Date())}`, newMember.guild.iconURL({format: "png", dynamic: true}) ?? "")
                await memberChannel.send(logEmbed).catch(() => null)
            }
        }
        if (setNewRole) logNewRole(oldMember, newMember)

        const logRoleRemoval = async (oldMember: GuildMember, newMember: GuildMember) => {
            const memberLog = await sql.fetchColumn("logs", "member log")
            if (memberLog) {
                const oldRole = oldMember.roles.cache.find((r) => {
                    if (newMember.roles.cache.has(r.id)) {
                        return false
                    } else {
                        return true
                    }
                }) as Role
                const memberChannel = newMember.guild?.channels.cache.get(memberLog)! as TextChannel
                const logEmbed = embeds.createEmbed()
                logEmbed
                .setAuthor("remove role", "https://cdn.discordapp.com/emojis/589239465348694017.png")
                .setTitle(`**Role Removal** ${discord.getEmoji("raphi")}`)
                .setThumbnail(newMember.user.displayAvatarURL({format: "png", dynamic: true}))
                .setDescription(
                    `${discord.getEmoji("star")}_User:_ **<@!${newMember.id}> (${newMember.user.tag})**\n` +
                    `${discord.getEmoji("star")}_User ID:_ \`${newMember.id}\`\n` +
                    `${discord.getEmoji("star")}_Removed Role:_ <@&${oldRole.id}>\n` +
                    `${discord.getEmoji("star")}_Roles:_ **${newMember.roles.cache.size - 1}**`
                )
                .setFooter(`${newMember.guild.name} • ${Functions.formatDate(new Date())}`, newMember.guild.iconURL({format: "png", dynamic: true}) ?? "")
                await memberChannel.send(logEmbed).catch(() => null)
            }
        }
        if (setRemoveRole) logRoleRemoval(oldMember, newMember)
    }
}
