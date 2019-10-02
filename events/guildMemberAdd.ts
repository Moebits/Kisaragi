import {GuildMember, Message, MessageAttachment, TextChannel} from "discord.js"
import {Embeds} from "../structures/Embeds"
import {Images} from "./../structures/Images"
import {Kisaragi} from "./../structures/Kisaragi"
import {SQLQuery} from "./../structures/SQLQuery"

export default class GuildMemberAdd {
    public discord: Kisaragi
    constructor(discord: Kisaragi) {
        this.discord = discord
    }

    public run = async (member: GuildMember) => {
        const firstMsg = await this.discord.fetchFirstMessage(member.guild)
        const sql = new SQLQuery(firstMsg as Message)
        const bans = await member.guild.fetchBans()
        if (bans.has(member.id)) return

        let defaultChannel = firstMsg!.channel as TextChannel
        const defChannel = await sql.fetchColumn("blocks", "default channel")
        if (defChannel.join("")) {
        defaultChannel = this.discord.channels.find((c) => c.id.toString() === defChannel.join("")) as TextChannel
        }

        const defMsg = defaultChannel ? await defaultChannel.messages.fetch({limit: 1}).then((m) => m.first()) as Message :
        await this.discord.fetchFirstMessage(member.guild) as Message

        const image = new Images(this.discord, defMsg)
        const embeds = new Embeds(this.discord, defMsg)

        async function welcomeMessages() {
        const welcomeToggle = await sql.fetchColumn("welcome leaves", "welcome toggle")
        if (welcomeToggle.join("") === "off") return

        const welcomeMsg = await sql.fetchColumn("welcome leaves", "welcome message")
        const welcomeChannel = await sql.fetchColumn("welcome leaves", "welcome channel")
        const welcomeImage = await sql.fetchColumn("welcome leaves", "welcome bg image")
        const welcomeText = await sql.fetchColumn("welcome leaves", "welcome bg text")
        const welcomeColor = await sql.fetchColumn("welcome leaves", "welcome bg color")
        const channel = member.guild.channels.find((c) => c.id.toString() === welcomeChannel.join("")) as TextChannel

        const attachment = await image.createCanvas(member, welcomeImage, welcomeText, welcomeColor) as MessageAttachment

        const newMsg = welcomeMsg.join("").replace(/user/g, `<@${member.user.id}>`).replace(/guild/g, member.guild.name)
        .replace(/tag/g, member.user.tag).replace(/name/g, member.displayName).replace(/count/g, member.guild.memberCount.toString())

        channel.send(newMsg, attachment)
    }

        welcomeMessages()

        async function avatarBan(discord: Kisaragi) {
        const banToggle = await sql.fetchColumn("blocks", "leaver ban toggle")
        const banEmbed: any = embeds.createEmbed()
        if (banToggle.join("") === "off") return

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
    }
}
