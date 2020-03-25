import {GuildChannel, Message, MessageAttachment} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Images} from "./../../structures/Images"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Leave extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Configures settings for leave messages.",
            help:
            `
            \`leave\` - Opens the leave prompt.
            \`leave enable/disable\` - Enables or disables leave messages
            \`leave msg\` - Sets the leave message
            \`leave #channel\` - Sets the channel where messages are sent
            \`leave url\` - Sets the image url
            \`leave [msg]\` - Sets the background text
            \`leave rainbow/#hexcolor\` - Sets the background text color
            \`leave reset\` - Resets settings to the default
            `,
            examples:
            `
            \`=>leave user left guild! #channel [tag left!] rainbow\`
            \`=>leave reset\`
            `,
            guildOnly: true,
            aliases: ["farewell"],
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        const embeds = new Embeds(discord, message)
        const images = new Images(discord, message)
        const sql = new SQLQuery(message)
        if (!await perms.checkAdmin()) return
        const axios = require("axios")
        const input = Functions.combineArgs(args, 1)
        if (input.trim()) {
            message.content = input.trim()
            leavePrompt(message)
            return
        }
        const leaveEmbed = embeds.createEmbed()
        const leaveMsg = await sql.fetchColumn("welcome leaves", "leave message")
        const leaveToggle = await sql.fetchColumn("welcome leaves", "leave toggle")
        const leaveChannel = await sql.fetchColumn("welcome leaves", "leave channel")
        const leaveImage = await sql.fetchColumn("welcome leaves", "leave bg image")
        const leaveText = await sql.fetchColumn("welcome leaves", "leave bg text")
        const leaveColor = await sql.fetchColumn("welcome leaves", "leave bg color")
        const attachment = await images.createCanvas(message.member!, leaveImage, leaveText, leaveColor) as MessageAttachment
        const json = await axios.get(`https://is.gd/create.php?format=json&url=${leaveImage}`)
        const newImg = json.data.shorturl
        leaveEmbed
        .setTitle(`**Leave Messages** ${discord.getEmoji("sagiriBleh")}`)
        .setThumbnail(message.guild!.iconURL({format: "png", dynamic: true})!)
        .attachFiles([attachment])
        .setImage(`attachment://${attachment.name ? attachment.name : "animated.gif"}`)
        .setDescription(Functions.multiTrim(`
            View and edit the settings for leave messages!
            newline
            __Text Replacements:__
            **user** - mention
            **tag** - member tag
            **name** - member name
            **guild** - guild name
            **count** - guild member count
            newline
            __Current Settings:__
            ${discord.getEmoji("star")}_Leave Message:_ **${leaveMsg}**
            ${discord.getEmoji("star")}_Leave Channel:_ **${leaveChannel ?  `<#${leaveChannel}>`  :  "None"}**
            ${discord.getEmoji("star")}_Leave Toggle:_ **${leaveToggle}**
            ${discord.getEmoji("star")}_Background Image:_ **${newImg}**
            ${discord.getEmoji("star")}_Background Text:_ **${leaveText}**
            ${discord.getEmoji("star")}_Background Text Color:_ **${leaveColor}**
            newline
            __Edit Settings:__
            ${discord.getEmoji("star")}_**Type any message** to set it as the leave message._
            ${discord.getEmoji("star")}_Type **enable** or **disable** to enable or disable leave messages._
            ${discord.getEmoji("star")}_**Mention a channel** to set it as the leave channel._
            ${discord.getEmoji("star")}_Post an **image URL** (jpg, png, gif) to set the background image._
            ${discord.getEmoji("star")}_Add brackets **[text]** to set the background text._
            ${discord.getEmoji("star")}_Type **rainbow** or a **hex color** to set the background text color._
            ${discord.getEmoji("star")}_**You can type multiple options** to set them at once._
            ${discord.getEmoji("star")}_Type **reset** to reset settings._
            ${discord.getEmoji("star")}_Type **cancel** to exit._
        `))
        message.channel.send(leaveEmbed)

        async function leavePrompt(msg: Message) {
            const responseEmbed = embeds.createEmbed()
            let setMsg, setOn, setOff, setChannel, setImage, setBGText, setBGColor
            responseEmbed.setTitle(`**Leave Messages** ${discord.getEmoji("sagiriBleh")}`)
            const newMsg = msg.content.replace(/<#\d+>/g, "").replace(/\[(.*)\]/g, "").replace(/enable/g, "").replace(/rainbow/g, "")
            .replace(/disable/g, "").replace(/#[0-9a-f]{3,6}/ig, "").replace(/(https?:\/\/[^\s]+)/g, "")
            const newImage = msg.content.match(/(https?:\/\/[^\s]+)/g)
            const newBGText = msg.content.match(/\[(.*)\]/g)
            const newBGColor = (msg.content.match(/rainbow/g) || msg.content.match(/(\s|^)#[0-9a-f]{3,6}/ig))
            if (msg.content.toLowerCase() === "cancel") {
                responseEmbed
                .setDescription(`${discord.getEmoji("star")}Canceled the prompt!`)
                msg.channel.send(responseEmbed)
                return
            }
            if (msg.content.toLowerCase() === "reset") {
                await sql.updateColumn("welcome leaves", "leave message", "user has left guild!")
                await sql.updateColumn("welcome leaves", "leave channel", null)
                await sql.updateColumn("welcome leaves", "leave toggle", "off")
                await sql.updateColumn("welcome leaves", "leave bg image", "https://data.whicdn.com/images/210153523/original.gif")
                await sql.updateColumn("welcome leaves", "leave bg text", "tag left! There are now count members.")
                await sql.updateColumn("welcome leaves", "leave bg color", "rainbow")
                responseEmbed
                .setDescription(`${discord.getEmoji("star")}Leave settings were reset!`)
                msg.channel.send(responseEmbed)
                return
            }

            if (newBGColor) setBGColor = true
            if (newMsg.trim()) setMsg = true
            if (msg.content.toLowerCase().includes("enable")) setOn = true
            if (msg.content.toLowerCase() === "disable") setOff = true
            if (msg.mentions.channels.array()) setChannel = true
            if (newImage) setImage = true
            if (newBGText) setBGText = true

            if (setOn && setOff) {
                responseEmbed
                    .setDescription(`${discord.getEmoji("star")}You cannot disable/enable at the same time.`)
                msg.channel.send(responseEmbed)
                return
            }

            if (!setChannel && setOn) {
                    responseEmbed
                    .setDescription(`${discord.getEmoji("star")}In order to enable leave messages, you must specify a leave channel!`)
                    msg.channel.send(responseEmbed)
                    return
            }
            let description = ""
            if (setMsg) {
                await sql.updateColumn("welcome leaves", "leave message", String(newMsg.trim()))
                description += `${discord.getEmoji("star")}Leave Message set to **${newMsg.trim()}**\n`
            }
            if (setChannel) {
                const channel = msg.guild!.channels.cache.find((c: GuildChannel) => c === msg.mentions.channels.first())
                await sql.updateColumn("welcome leaves", "leave channel", String(channel!.id))
                setOn = true
                description += `${discord.getEmoji("star")}Leave channel set to <#${channel!.id}>!\n`
            }
            if (setOn) {
                await sql.updateColumn("welcome leaves", "leave toggle", "on")
                description += `${discord.getEmoji("star")}Leave Messages are **on**!\n`
            }
            if (setOff) {
                await sql.updateColumn("welcome leaves", "leave toggle", "off")
                description += `${discord.getEmoji("star")}Leave Messages are **off**!\n`
            }
            if (setImage) {
                await sql.updateColumn("welcome leaves", "leave bg image", String(newImage![0]))
                description += `${discord.getEmoji("star")}Background image set to **${newImage![0]}**!\n`
            }
            if (setBGText) {
                await sql.updateColumn("welcome leaves", "leave bg text", String(newBGText![0].replace(/\[/g, "").replace(/\]/g, "")))
                description += `${discord.getEmoji("star")}Background text set to **${newBGText![0].replace(/\[/g, "").replace(/\]/g, "")}**\n`
            }
            if (setBGColor) {
                await sql.updateColumn("welcome leaves", "leave bg color", String(newBGColor![0]))
                description += `${discord.getEmoji("star")}Background color set to **${newBGColor![0]}**!\n`
            }

            responseEmbed
            .setDescription(description)
            msg.channel.send(responseEmbed)
            return
        }

        embeds.createPrompt(leavePrompt)
    }
}
