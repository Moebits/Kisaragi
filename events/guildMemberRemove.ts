import {GuildMember, Message, MessageAttachment, TextChannel} from "discord.js"
import {Embeds} from "./../structures/Embeds"
import {Images} from "./../structures/Images"
import {Kisaragi} from "./../structures/Kisaragi"
import {SQLQuery} from "./../structures/SQLQuery"

export default class GuildMemberRemove {
    constructor(private readonly discord: Kisaragi) {}

    public run = async (member: GuildMember) => {
        const firstMsg = await this.discord.fetchFirstMessage(member.guild) as Message
        const sql = new SQLQuery(firstMsg)
        const bans = await member.guild.fetchBans()
        if (bans.has(member.id)) return

        let defaultChannel = firstMsg.channel as TextChannel
        const defChannel = await sql.fetchColumn("blocks", "default channel")
        if (defChannel.join("")) {
        defaultChannel = this.discord.channels.find((c) => c.id.toString() === defChannel.join("")) as TextChannel
        }

        const defMsg = defaultChannel ? await defaultChannel.messages.fetch({limit: 1}).then((m) => m.first()) as Message :
        await this.discord.fetchFirstMessage(member.guild) as Message

        const image = new Images(this.discord, defMsg)
        const embeds = new Embeds(this.discord, defMsg)

        async function leaveMessages() {
        const leaveToggle = await sql.fetchColumn("welcome leaves", "leave toggle")
        if (leaveToggle.join("") === "off") return

        const leaveMsg = await sql.fetchColumn("welcome leaves", "leave message")
        const leaveChannel = await sql.fetchColumn("welcome leaves", "leave channel")
        const leaveImage = await sql.fetchColumn("welcome leaves", "leave bg image")
        const leaveText = await sql.fetchColumn("welcome leaves", "leave bg text")
        const leaveColor = await sql.fetchColumn("welcome leaves", "leave bg color")
        const channel = member.guild.channels.find((c) => c.id.toString() === leaveChannel.join("")) as TextChannel

        const attachment = await image.createCanvas(member, leaveImage[0], leaveText[0], leaveColor[0]) as MessageAttachment

        const newMsg = leaveMsg.join("").replace(/user/g, `<@${member.user.id}>`).replace(/guild/g, member.guild.name)
        .replace(/tag/g, member.user.tag).replace(/name/g, member.displayName).replace(/count/g, member.guild.memberCount.toString())

        channel.send(newMsg, attachment)
    }

        leaveMessages()

        async function leaveBan(discord: Kisaragi) {
        const leaveToggle = await sql.fetchColumn("blocks", "leaver ban toggle")
        const banEmbed = embeds.createEmbed()
        if (leaveToggle.join("") === "off") return

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
    }
}
