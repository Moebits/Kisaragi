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
        const sql = new SQLQuery(firstMsg as Message)
        if (member.guild.me?.permissions.has("MANAGE_GUILD")) {
            const bans = await member.guild.fetchBans()
            if (bans.has(member.id)) return
        }

        let defaultChannel = firstMsg!.channel as TextChannel
        const defChannel = await sql.fetchColumn("blocks", "default channel")
        if (defChannel) {
            defaultChannel = this.discord.channels.cache.find((c) => c.id.toString() === String(defChannel)) as TextChannel
        }

        const defMsg = defaultChannel ? await defaultChannel.messages.fetch({limit: 1}).then((m) => m.first()) as Message :
        await this.discord.fetchFirstMessage(member.guild) as Message

        const image = new Images(this.discord, defMsg)
        const embeds = new Embeds(this.discord, defMsg)

        const welcomeMessages = async () => {
            const welcomeToggle = await sql.fetchColumn("welcome leaves", "welcome toggle")
            if (!(welcomeToggle === "on")) return

            const welcomeMsg = await sql.fetchColumn("welcome leaves", "welcome message")
            const welcomeChannel = await sql.fetchColumn("welcome leaves", "welcome channel")
            const welcomeImage = await sql.fetchColumn("welcome leaves", "welcome bg image")
            const welcomeText = await sql.fetchColumn("welcome leaves", "welcome bg text")
            const welcomeColor = await sql.fetchColumn("welcome leaves", "welcome bg color")
            const channel = member.guild.channels.cache.find((c) => c.id.toString() === String(welcomeChannel)) as TextChannel

            const attachment = await image.createCanvas(member, String(welcomeImage), String(welcomeText), String(welcomeColor)) as MessageAttachment

            const newMsg = String(welcomeMsg).replace(/user/g, `<@${member.user.id}>`).replace(/guild/g, member.guild.name)
            .replace(/tag/g, member.user.tag).replace(/name/g, member.displayName).replace(/count/g, member.guild.memberCount.toString())

            channel.send(newMsg, attachment)
        }

        welcomeMessages()

        const avatarBan = async (discord: Kisaragi) => {
            const banToggle = await sql.fetchColumn("blocks", "leaver ban toggle")
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
            const userLog = await sql.fetchColumn("logs", "user log")
            if (userLog) {
                const joinChannel = member.guild?.channels.cache.get(userLog)! as TextChannel
                const joinEmbed = embeds.createEmbed()
                joinEmbed
                .setAuthor("join", "https://cdn.discordapp.com/emojis/588199024906207271.gif")
                .setTitle(`**Member Join** ${discord.getEmoji("akariLurk")}`)
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
    }
}
