import {GuildChannel, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class ChannelLink extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Configure settings for linked channels.",
            aliases: [],
            guildOnly: true,
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        const embeds = new Embeds(discord, message)
        const sql = new SQLQuery(message)
        if (!await perms.checkAdmin()) return
        const input = Functions.combineArgs(args, 1)
        if (input.trim()) {
            message.content = input.trim()
            linkPrompt(message)
            return
        }
        const linkText = await sql.fetchColumn("links", "text")
        const linkVoice = await sql.fetchColumn("links", "voice")
        const linkToggle = await sql.fetchColumn("links", "toggle")

        let linkDescription = ""
        if (linkText) {
            for (let i = 0; i < linkText[0].length; i++) {
                linkDescription += `**${i + 1} => **\n` + `${discord.getEmoji("star")}_Text:_ <#${linkText[i]}>\n` +
                `${discord.getEmoji("star")}_Voice:_ **<#${linkVoice[i]}>**\n` +
                `${discord.getEmoji("star")}_State:_ **${linkToggle[i]}**\n`
            }
        } else {
            linkDescription = "None"
        }
        const linkEmbed = embeds.createEmbed()
        linkEmbed
        .setTitle(`**Linked Channels** ${discord.getEmoji("gabSip")}`)
        .setThumbnail(message.guild!.iconURL({format: "png", dynamic: true})!)
        .setDescription(Functions.multiTrim(`
            Configure settings for linked channels. You can link a text channel to a voice channel so that only people in the voice channel can access it.
            In order for this to work, you should disable the **read messages** permission on the text channel for all member roles.
            newline
            **Status** = Either on or off. In order for the status to be on, both the voice and text channel must be set.
            newline
            __Current Settings:__
            ${linkDescription}
            newline
            __Edit Settings:__
            ${discord.getEmoji("star")}_**Mention a text channel** to set the text channel._
            ${discord.getEmoji("star")}_**Type the name of the voice channel** to set the voice channel._
            ${discord.getEmoji("star")}_Type **toggle (setting number)** to toggle the status._
            ${discord.getEmoji("star")}_Type **edit (setting number)** to edit a setting._
            ${discord.getEmoji("star")}_Type **delete (setting number)** to delete a setting._
            ${discord.getEmoji("star")}_Type **reset** to delete all settings._
            ${discord.getEmoji("star")}_Type **cancel** to exit._
        `))
        message.channel.send(linkEmbed)

        async function linkPrompt(msg: Message) {
            let text = await sql.fetchColumn("links", "text")
            let voice = await sql.fetchColumn("links", "voice")
            let toggle = await sql.fetchColumn("links", "toggle")
            let [setText, setVoice, setInit] = [] as boolean[]
            if (!text[0]) text = [""]; setInit = true
            if (!voice[0]) voice = [""]; setInit = true
            if (!toggle[0]) toggle = [""]; setInit = true
            const responseEmbed = embeds.createEmbed()
            responseEmbed.setTitle(`**Linked Channels** ${discord.getEmoji("gabSip")}`)
            if (msg.content.toLowerCase() === "cancel") {
                responseEmbed
                .setDescription(`${discord.getEmoji("star")}Canceled the prompt!`)
                msg.channel.send(responseEmbed)
                return
            }
            if (msg.content.toLowerCase() === "reset") {
                await sql.updateColumn("links", "voice", null)
                await sql.updateColumn("links", "text", null)
                await sql.updateColumn("links", "toggle", "off")
                responseEmbed
                .setDescription(`${discord.getEmoji("star")}All settings were reset!`)
                msg.channel.send(responseEmbed)
                return
            }
            if (msg.content.toLowerCase().includes("delete")) {
                const num = Number(msg.content.replace(/delete/gi, "").replace(/\s+/g, ""))
                if (num) {
                    if (text) {
                        text[num - 1] = ""
                        voice[num - 1] = ""
                        toggle[num - 1] = ""
                        text = text.filter(Boolean)
                        voice = voice.filter(Boolean)
                        toggle = toggle.filter(Boolean)
                        await sql.updateColumn("links", "text", text)
                        await sql.updateColumn("links", "voice", voice)
                        await sql.updateColumn("links", "toggle", toggle)
                        responseEmbed
                        .setDescription(`${discord.getEmoji("star")}Setting ${num} was deleted!`)
                        msg.channel.send(responseEmbed)
                        return
                    }
                } else {
                    responseEmbed
                    .setDescription(`${discord.getEmoji("star")}Setting not found!`)
                    msg.channel.send(responseEmbed)
                    return
                }
            }

            const newText = msg.content.match(/<#\d+>/g)
            const newVoice = msg.content.replace(/<#\d+>/g, "").match(/\D+/gi)
            if (newText) setText = true
            if (newVoice) setVoice = true

            let description = ""

            if (setText) {
                text.push(String(newText!).replace(/<#/g, "").replace(/>/g, ""))
                if (setInit) text = text.filter(Boolean)
                await sql.updateColumn("links", "text", String(text))
                description += `${discord.getEmoji("star")}Text channel set to **${newText!}**!\n`
            }

            if (setVoice) {
                const channels = msg.guild!.channels.cache.filter((c: GuildChannel) => {
                    const type = c.type === "voice" ? true : false
                    return type
                })
                const channel = channels.find((c: GuildChannel) => {
                    const name = (c.name.replace(/\s+/g, " ").toLowerCase().includes(newVoice![0].toLowerCase())) ? true : false
                    return name
                })
                if (channel) {
                    voice.push(channel.id)
                    if (setInit) voice = voice.filter(Boolean)
                    await sql.updateColumn("links", "voice", String(voice))
                    description += `${discord.getEmoji("star")}Voice channel set to **${channel.name}**!\n`
                } else {
                    return msg.channel.send(responseEmbed.setDescription("Voice channel not found!"))
                }
            }

            if (setText && setVoice) {
                toggle.push("on")
                if (setInit) toggle = toggle.filter(Boolean)
                await sql.updateColumn("links", "toggle", String(toggle))
                description += `${discord.getEmoji("star")}Status set to **on**!\n`
            } else {
                toggle.push("off")
                if (setInit) toggle = toggle.filter(Boolean)
                await sql.updateColumn("links", "toggle", String(toggle))
                description += `${discord.getEmoji("star")}Status set to **off**!\n`
            }

            if (!description) description = `${discord.getEmoji("star")}Invalid arguments provided, canceled the prompt.`
            responseEmbed
            .setDescription(description)
            msg.channel.send(responseEmbed)
            return
        }

        embeds.createPrompt(linkPrompt)
    }
}
