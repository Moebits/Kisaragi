import {GuildChannel, Message, MessageAttachment} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Images} from "../../structures/Images"
import {Permission} from "../../structures/Permission"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Welcome extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Configures settings for welcome messages.",
            help:
            `
            \`welcome\` - Opens the welcome messages prompt
            \`welcome msg\` - Sets the welcome message
            \`welcome #channel\` - Sets the channel where welcome messages are sent
            \`welcome url\` - Sets the background image url
            \`welcome [msg]\` - Sets the background text
            \`welcome rainbow/#hexcolor\` - Sets the background text color
            \`welcome reset\` - Resets welcome settings to the default
            `,
            examples:
            `
            \`=>welcome welcome user to guild! [welcome tag! There are now count members.]\`
            \`=>welcome enable rainbow\`
            `,
            guildOnly: true,
            aliases: ["greeting"],
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const sql = new SQLQuery(message)
        const embeds = new Embeds(discord, message)
        const images = new Images(discord, message)
        const perms = new Permission(discord, message)
        const star = discord.getEmoji("star")
        if (!await perms.checkAdmin()) return
        const axios = require("axios")
        const input = Functions.combineArgs(args, 1)
        if (input.trim()) {
            message.content = input.trim()
            welcomePrompt(message)
            return
        }
        const welcomeEmbed = embeds.createEmbed()
        const welcomeMsg = await sql.fetchColumn("welcome leaves", "welcome message")
        const welcomeToggle = await sql.fetchColumn("welcome leaves", "welcome toggle")
        const welcomeChannel = await sql.fetchColumn("welcome leaves", "welcome channel")
        const welcomeImage = await sql.fetchColumn("welcome leaves", "welcome bg image")
        const welcomeText = await sql.fetchColumn("welcome leaves", "welcome bg text")
        const welcomeColor = await sql.fetchColumn("welcome leaves", "welcome bg color")
        const attachment = await images.createCanvas(message.member!, welcomeImage[0], welcomeText[0], welcomeColor[0]) as MessageAttachment
        const json = await axios.get(`https://is.gd/create.php?format=json&url=${welcomeImage.join("")}`)
        const newImage = json.data.shorturl
        welcomeEmbed
        .setTitle(`**Welcome Messages** ${discord.getEmoji("karenSugoi")}`)
        .setThumbnail(message.guild!.iconURL({format: "png", dynamic: true})!)
        .attachFiles([attachment])
        .setImage(`attachment://${attachment.name ? attachment.name : "animated.gif"}`)
        .setDescription(Functions.multiTrim(`
            View and edit the settings for welcome messages!
            newline
            __Text Replacements:__
            **user** = member mention
            **tag** = member tag
            **name** = member name
            **guild** = guild name
            **count** = guild member count
            newline
            __Current Settings:__
            ${star}_Welcome Message:_ **${welcomeMsg}**
            ${star}_Welcome Channel:_ **${welcomeChannel.join("") ?  `<#${welcomeChannel}>`  :  "None"}**
            ${star}_Welcome Toggle:_ **${welcomeToggle}**
            ${star}_Background Image:_ **${newImage}**
            ${star}_Background Text:_ **${welcomeText}**
            ${star}_Background Text Color:_ **${welcomeColor}**
            newline
            __Edit Settings:__
            ${star}_**Type any message** to set it as the welcome message._
            ${star}_Type **enable** or **disable** to enable or disable welcome messages._
            ${star}_**Mention a channel** to set it as the welcome channel._
            ${star}_Post an **image URL** (jpg, png, gif) to set the background image._
            ${star}_Add brackets **[text]** to set the background text._
            ${star}_Type **rainbow** or a **hex color** to set the background text color._
            ${star}_**You can type multiple options** to set them at once._
            ${star}_Type **reset** to reset settings._
            ${star}_Type **cancel** to exit._
        `))
        message.channel.send(welcomeEmbed)

        async function welcomePrompt(msg: Message) {
            const responseEmbed = embeds.createEmbed()
            let [setMsg, setOn, setOff, setChannel, setImage, setBGText, setBGColor] = [] as boolean[]
            responseEmbed.setTitle(`**Welcome Messages** ${discord.getEmoji("karenSugoi")}`)
            const newMsg = msg.content.replace(/<#\d+>/g, "").replace(/\[(.*)\]/g, "").replace(/enable/g, "").replace(/rainbow/g, "")
            .replace(/disable/g, "").replace(/#[0-9a-f]{3,6}/ig, "").replace(/(https?:\/\/[^\s]+)/g, "")
            const newImg = msg.content.match(/(https?:\/\/[^\s]+)/g)
            const newBGText = msg.content.match(/\[(.*)\]/g)
            const newBGColor = (msg.content.match(/rainbow/g) || msg.content.match(/(\s|^)#[0-9a-f]{3,6}/ig))
            if (msg.content.toLowerCase() === "cancel") {
                responseEmbed
                .setDescription(`${discord.getEmoji("star")}Canceled the prompt!`)
                msg.channel.send(responseEmbed)
                return
            }
            if (msg.content.toLowerCase() === "reset") {
                await sql.updateColumn("welcome leaves", "welcome message", "Welcome to guild, user!")
                await sql.updateColumn("welcome leaves", "welcome channel", null)
                await sql.updateColumn("welcome leaves", "welcome toggle", "off")
                await sql.updateColumn("welcome leaves", "welcome bg image", "https://66.media.tumblr.com/692aa1fd2a5ad428d92b27ccf65d4a94/tumblr_inline_n0oiz974M41s829k0.gif")
                await sql.updateColumn("welcome leaves", "welcome bg text", "Welcome tag! There are now count members.")
                await sql.updateColumn("welcome leaves", "welcome bg color", "rainbow")
                responseEmbed
                .setDescription(`${discord.getEmoji("star")}Welcome settings were reset!`)
                msg.channel.send(responseEmbed)
                return
            }

            if (newBGColor) setBGColor = true
            if (newMsg.trim()) setMsg = true
            if (msg.content.toLowerCase().includes("enable")) setOn = true
            if (msg.content.toLowerCase() === "disable") setOff = true
            if (msg.mentions.channels.array().join("")) setChannel = true
            if (newImg) setImage = true
            if (newBGText) setBGText = true

            if (setOn && setOff) {
                responseEmbed
                    .setDescription(`${discord.getEmoji("star")}You cannot disable/enable at the same time.`)
                msg.channel.send(responseEmbed)
                return
            }

            if (!setChannel && setOn) {
                    responseEmbed
                    .setDescription(`${discord.getEmoji("star")}In order to enable welcome messages, you must specify a welcome channel!`)
                    msg.channel.send(responseEmbed)
                    return
            }
            let description = ""
            if (setMsg) {
                await sql.updateColumn("welcome leaves", "welcome message", String(newMsg.trim()))
                description += `${discord.getEmoji("star")}Welcome message set to **${newMsg.trim()}**\n`
            }
            if (setChannel) {
                const channel = msg.guild!.channels.cache.find((c: GuildChannel) => c === msg.mentions.channels.first())
                await sql.updateColumn("welcome leaves", "welcome channel", String(channel!.id))
                setOn = true
                description += `${discord.getEmoji("star")}Welcome channel set to <#${channel!.id}>!\n`
            }
            if (setOn) {
                await sql.updateColumn("welcome leaves", "welcome toggle", "on")
                description += `${discord.getEmoji("star")}Welcome messages are **on**!\n`
            }
            if (setOff) {
                await sql.updateColumn("welcome leaves", "welcome toggle", "off")
                description += `${discord.getEmoji("star")}Welcome messages are **off**!\n`
            }
            if (setImage) {
                await sql.updateColumn("welcome leaves", "welcome bg image", String(newImg![0]))
                description += `${discord.getEmoji("star")}Background image set to **${newImg![0]}**!\n`
            }
            if (setBGText) {
                await sql.updateColumn("welcome leaves", "welcome bg text", String(newBGText![0].replace(/\[/g, "").replace(/\]/g, "")))
                description += `${discord.getEmoji("star")}Background text set to **${newBGText![0].replace(/\[/g, "").replace(/\]/g, "")}**\n`
            }
            if (setBGColor) {
                await sql.updateColumn("welcome leaves", "welcome bg color", String(newBGColor![0].trim()))
                description += `${discord.getEmoji("star")}Background color set to **${newBGColor![0].trim()}**!\n`
            }

            responseEmbed
            .setDescription(description)
            msg.channel.send(responseEmbed)
            return
        }

        embeds.createPrompt(welcomePrompt)
    }
}
