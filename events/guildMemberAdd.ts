import {Guild, GuildMember, Message, MessageAttachment, TextChannel, User} from "discord.js"
import {Embeds} from "../structures/Embeds"
import {Functions} from "./../structures/Functions"
import {Images} from "./../structures/Images"
import {Kisaragi} from "./../structures/Kisaragi"
import {SQLQuery} from "./../structures/SQLQuery"

export default class GuildMemberAdd {
    public discord: Kisaragi
    constructor(discord: Kisaragi) {
        this.discord = discord
    }

    public run = async (member: GuildMember) => {
        const discord = this.discord
        const firstMsg = await this.discord.fetchFirstMessage(member.guild)
        if (!firstMsg) return
        const sql = new SQLQuery(firstMsg)
        if (member.guild.me?.permissions.has("MANAGE_GUILD")) {
            const bans = await member.guild.fetchBans()
            if (bans.has(member.id)) return
        }

        let defaultChannel = firstMsg?.channel as TextChannel
        const defChannel = await sql.fetchColumn("guilds", "default channel")
        if (defChannel) {
            defaultChannel = this.discord.channels.cache.find((c) => c.id.toString() === String(defChannel)) as TextChannel
        }

        const defMsg = defaultChannel ? await defaultChannel.messages.fetch({limit: 1}).then((m) => m.first()) as Message :
        await this.discord.fetchFirstMessage(member.guild) as Message

        const image = new Images(this.discord, defMsg)
        const embeds = new Embeds(this.discord, defMsg)

        const welcomeMessages = async () => {
            const welcomeToggle = await sql.fetchColumn("guilds", "welcome toggle")
            if (!(welcomeToggle === "on")) return

            const welcomeMsg = await sql.fetchColumn("guilds", "welcome message")
            const welcomeChannel = await sql.fetchColumn("guilds", "welcome channel")
            const welcomeImages = await sql.fetchColumn("guilds", "welcome bg images")
            const welcomeText = await sql.fetchColumn("guilds", "welcome bg text")
            const welcomeColor = await sql.fetchColumn("guilds", "welcome bg color")
            const welcomeBGToggle = await sql.fetchColumn("guilds", "welcome bg toggle")
            const channel = member.guild.channels.cache.find((c) => c.id.toString() === String(welcomeChannel)) as TextChannel

            const attachment = await image.createCanvas(member, welcomeImages, welcomeText, welcomeColor, false, false, welcomeBGToggle) as MessageAttachment

            const newMsg = String(welcomeMsg).replace(/user/g, `<@${member.user.id}>`).replace(/guild/g, member.guild.name)
            .replace(/tag/g, member.user.tag).replace(/name/g, member.displayName).replace(/count/g, member.guild.memberCount.toString())

            channel.send(newMsg, attachment)
        }

        welcomeMessages()

        const avatarBan = async (discord: Kisaragi) => {
            const banToggle = await sql.fetchColumn("guilds", "leaver ban toggle")
            const banEmbed = embeds.createEmbed()
            if (!(banToggle === "on")) return

            if (!member.user.avatarURL) {
                const channel = defaultChannel
                const reason = "Has the default discord avatar."
                banEmbed
                .setAuthor("ban", "https://discordemoji.com/assets/emoji/bancat.png")
                .setTitle(`**Member Banned** ${discord.getEmoji("kannaFU")}`)
                .setDescription(`${discord.getEmoji("star")}_Successfully banned <@${member.user.id}> for reason:_ **${reason}**`)
                if (channel) channel.send(banEmbed)
                banEmbed
                .setTitle(`**You Were Banned** ${discord.getEmoji("kannaFU")}`)
                .setDescription(`${discord.getEmoji("star")}_You were banned from ${member.guild.name} for reason:_ **${reason}**`)
                const dm = await member.user.createDM()
                try {
                    await dm.send(banEmbed)
                } catch (err) {
                    console.log(err)
                }
                await member.ban({reason})
            }
        }
        avatarBan(this.discord)

        const logJoin = async (member: GuildMember) => {
            const userLog = await sql.fetchColumn("guilds", "user log")
            if (userLog) {
                const joinChannel = member.guild?.channels.cache.get(userLog)! as TextChannel
                const joinEmbed = embeds.createEmbed()
                joinEmbed
                .setAuthor("join", "https://cdn.discordapp.com/emojis/588199024906207271.gif")
                .setTitle(`**Member Join** ${discord.getEmoji("aquaUp")}`)
                .setThumbnail(member.user.displayAvatarURL({format: "png", dynamic: true}))
                .setDescription(
                    `${discord.getEmoji("star")}_Member:_ **<@!${member.id}> (${member.user.tag})**\n` +
                    `${discord.getEmoji("star")}_Member ID:_ \`${member.id}\`\n` +
                    `${discord.getEmoji("star")}_Bot Account:_ **${member.user.bot ? "Yes" : "No"}**\n` +
                    `${discord.getEmoji("star")}_Account Creation Date:_ **${Functions.formatDate(member.user.createdAt)}**\n` +
                    `${discord.getEmoji("star")}_Guild Members:_ **${member.guild.members.cache.size}**\n`
                )
                .setFooter(`${member.guild.name} • ${Functions.formatDate(member.joinedAt ?? new Date())}`, member.guild.iconURL({format: "png", dynamic: true}) ?? "")
                await joinChannel.send(joinEmbed).catch(() => null)
            }
        }
        logJoin(member)

        const logsEnabledDMs = async (member: GuildMember) => {
            const messageLog = await sql.fetchColumn("guilds", "message log")
            if (messageLog) {
                const embed = embeds.createEmbed()
                embed
                .setTitle(`**Logs Enabled** ${discord.getEmoji("kannaHungry")}`)
                .setThumbnail(member.user.displayAvatarURL({format: "png", dynamic: true}))
                .setDescription(
                    `${discord.getEmoji("star")}_Privacy Notice:_ The guild **${member.guild.name}** has deleted message logging enabled. This means that if you post
                    a message and then delete it, it could still be present on a channel within that guild. If you don't agree with this, we suggest leaving that guild.`
                )
                await member.send(embed).catch(() => null)
            }
        }
        logsEnabledDMs(member)
    }
}
