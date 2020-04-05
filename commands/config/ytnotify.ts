import axios from "axios"
import type {GuildEmoji, Message, MessageEmbed, TextChannel, Webhook} from "discord.js"
import Youtube from "youtube.ts"
import * as config from "../../config.json"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"
import {SQLQuery} from "../../structures/SQLQuery"

export default class YTNotify extends Command {
    private readonly youtube = new Youtube(process.env.GOOGLE_API_KEY!)
    private readonly sql = new SQLQuery(this.message)
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Configure youtube video upload notifications.",
            help:
            `
            \`ytnotify\` - Opens the yt notify prompt
            \`ytnotify ytid/name #channel @role/id?\` - Sets the youtube channel, text channel, and mention role (optional)
            \`ytnotify delete number\` - Deletes a setting
            \`ytnotify edit number @role/id?\` - Edits the role mention. Omit the role to remove role mentions
            \`ytnotify refresh\` - Refreshes all youtube subscriptions that could have been stopped (like restarting the server)
            `,
            examples:
            `
            \`=>ytnotify\`
            \`=>ytnotify tenpi #updates\`
            `,
            aliases: ["ytnotification", "ytnotifications"],
            botPermission: "MANAGE_WEBHOOKS",
            guildOnly: true,
            cooldown: 15
        })
    }

    public getName = async (channel: string) => {
        const search = await this.youtube.channels.get(channel)
        return search.snippet.title
    }

    public getYT = async (channels: string[]) => {
        const yt: any[] = []
        if (channels) {
            for (let i = 0; i < channels.length; i++) {
                const config = await this.sql.fetchColumn("yt", "config", "channel id", channels[i])
                if (!config?.[0]) continue
                for (let j = 0; j < config.length; j++) {
                    const current = JSON.parse(config[j])
                    if (current.guild === this.message.guild?.id) {
                        yt.push(current)
                    }
                }
            }
        }
        if (!yt?.[0]) yt.push({channel: null, text: null, guild: this.message.guild?.id, mention: "", state: "Off", id: null, token: null})
        return yt
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const self = this
        const sql = this.sql
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        if (!await perms.checkMod()) return
        const loading = message.channel.lastMessage
        loading?.delete()
        const input = Functions.combineArgs(args, 1)
        if (input.trim()) {
            message.content = input.trim()
            await ytPrompt(message)
            return
        }

        const channels = await sql.fetchColumn("special channels", "yt channels")
        const yt = await this.getYT(channels)
        const step = 3.0
        const increment = Math.ceil((yt ? yt.length : 1) / step)
        const ytArray: MessageEmbed[] = []
        for (let i = 0; i < increment; i++) {
            let ytDesc = ""
            for (let j = 0; j < step; j++) {
                if (yt[0]?.channel) {
                    const k = (i*step)+j
                    if (!yt[k]) break
                    const channel = yt[k]?.channel ? `[**${yt[k].name}**](https://www.youtube.com/channel/${yt[k].channel})` : "None"
                    ytDesc += `**${k + 1} =>**\n` +
                    `${discord.getEmoji("star")}YT Channel: ${channel}\n` +
                    `${discord.getEmoji("star")}Text Channel: ${yt[k].text ? `<#${yt[k].text}>` : "None"}\n` +
                    `${discord.getEmoji("star")}Role Mention: ${yt[k].mention ? yt[k].mention : "None"}\n` +
                    `${discord.getEmoji("star")}State: **${yt[k].state ? yt[k].state : "Off"}**\n`
                } else {
                    ytDesc = "None"
                }
            }
            const ytEmbed = embeds.createEmbed()
            ytEmbed
            .setTitle(`**YT Notify** ${discord.getEmoji("tohruSmug")}`)
            .setThumbnail(message.author.displayAvatarURL({format: "png", dynamic: true}))
            .setDescription(Functions.multiTrim(`
                Configure youtube upload notifications. To avoid triggering a link command, use the channel id instead (it's after youtube.com/channel/)
                newline
                **YT Channel** - The channel to receive upload notifications from.
                **Text Channel** - Where notifications are sent.
                **Role Mention** - Mentions a role on every upload (optional)
                newline
                __Current Settings__
                ${ytDesc}
                newline
                __Edit Settings__
                ${discord.getEmoji("star")}**Type a channel id or name** to set the youtube channel (required).
                ${discord.getEmoji("star")}**Mention a text channel** to set the text channel (required).
                ${discord.getEmoji("star")}**Mention a role or type a role id** to set the role mention.
                ${discord.getEmoji("star")}Type **toggle (setting number)** to toggle the state.
                ${discord.getEmoji("star")}Type **delete (setting number)** to delete a setting.
                ${discord.getEmoji("star")}Type **edit (setting number)** to edit the the role mention.
                ${discord.getEmoji("star")}Type **refresh** to refresh all subscriptions that could have been stopped (eg. server restart).
                ${discord.getEmoji("star")}Type **reset** to reset all settings.
                ${discord.getEmoji("star")}Type **cancel** to exit.
            `))
            ytArray.push(ytEmbed)
        }

        if (ytArray.length === 1) {
            message.channel.send(ytArray[0])
        } else {
            embeds.createReactionEmbed(ytArray)
        }

        async function ytPrompt(msg: Message) {
            let channels = await sql.fetchColumn("special channels", "yt channels")
            if (!channels) channels = []
            const yt = channels[0] ? await self.getYT(channels) : []
            const responseEmbed = embeds.createEmbed()
            .setTitle(`**YT Notify** ${discord.getEmoji("tohruSmug")}`)

            if (msg.content.toLowerCase() === "cancel") {
                responseEmbed
                .setDescription(`${discord.getEmoji("star")}Canceled the prompt!`)
                return msg.channel.send(responseEmbed)
            }
            if (msg.content.toLowerCase() === "reset") {
                await sql.updateColumn("special channels", "yt channels", null)
                await axios.delete(`${config.imagesAPI}/youtube`, {data: {channels, guild: message.guild?.id}})
                responseEmbed
                .setDescription(`${discord.getEmoji("star")}YT Notify settings were wiped!`)
                return msg.channel.send(responseEmbed)
            }
            if (msg.content.toLowerCase() === "refresh") {
                for (let i = 0; i < yt.length; i++) {
                    if (!yt[i]) break
                    const current = {...yt[i], refresh: true}
                    await axios.post(`${config.imagesAPI}/youtube`, current)
                }
                responseEmbed
                .setDescription(`${discord.getEmoji("star")}Re-subscribed to all youtube notifications!`)
                return msg.channel.send(responseEmbed)
            }
            if (msg.content.toLowerCase().includes("delete")) {
                const num = Number(msg.content.replace(/delete/gi, "").replace(/\s+/g, ""))
                if (Number.isNaN(num)) return msg.reply("Invalid setting number!")
                if (yt ? yt[num - 1] : false) {
                    const channel = yt[num - 1].channel
                    const index = channels.findIndex((c: string) => c === channel)
                    channels[index] = ""
                    channels = channels.filter(Boolean)
                    await sql.updateColumn("special channels", "yt channels", channels)
                    await axios.delete(`${config.imagesAPI}/youtube`, {data: {channels: [channel], guild: message.guild?.id}})
                    responseEmbed
                    .setDescription(`${discord.getEmoji("star")}Setting ${num} was deleted!`)
                    return msg.channel.send(responseEmbed)
                } else {
                    responseEmbed
                    .setDescription(`${discord.getEmoji("star")}Setting not found!`)
                    return msg.channel.send(responseEmbed)
                }
            }
            if (msg.content.toLowerCase().includes("toggle")) {
                const num = Number(msg.content.replace(/toggle/gi, "").replace(/\s+/g, ""))
                if (Number.isNaN(num)) return msg.reply("Invalid setting number!")
                if (yt ? yt[num - 1] : false) {
                    let desc = ""
                    const current = yt[num - 1]
                    if (current.state === "On") {
                        current.state = "Off"
                        desc += `${discord.getEmoji("star")}Setting ${num} was toggled **off**!`
                    } else {
                        current.state = "On"
                        desc += `${discord.getEmoji("star")}Setting ${num} was toggled **on**!`
                    }
                    await axios.post(`${config.imagesAPI}/youtube`, current)
                    responseEmbed
                    .setDescription(desc)
                    return msg.channel.send(responseEmbed)
                } else {
                    responseEmbed
                    .setDescription(`${discord.getEmoji("star")}Setting not found!`)
                    return msg.channel.send(responseEmbed)
                }
            }
            if (msg.content.toLowerCase().includes("edit")) {
                const newMsg = msg.content.replace(/edit/g, "").trim().split(" ")
                const tempMsg = newMsg.slice(1).join(" ")
                const num = Number(newMsg[0])
                if (Number.isNaN(num)) return msg.reply("Invalid setting number!")
                if (yt ? yt[num - 1] : false) {
                    const current = yt[num - 1]
                    let desc = ""
                    const nRole = tempMsg.match(/\d{10,}/)?.[0] ?? ""
                    if (nRole) {
                        const found = message.guild?.roles.cache.get(nRole)
                        if (!found) return msg.reply(`Invalid role ${discord.getEmoji("kannaFacepalm")}`)
                        current.mention = `<@&${nRole}>`
                        desc += `${discord.getEmoji("star")}Role mention set to <@&${nRole}>!\n`
                    } else {
                        current.mention = ""
                        desc += `${discord.getEmoji("star")}Role mentions removed!\n`
                    }
                    await axios.post(`${config.imagesAPI}/youtube`, current)
                    responseEmbed
                    .setDescription(desc)
                    return msg.channel.send(responseEmbed)
                } else {
                    responseEmbed
                    .setDescription(`${discord.getEmoji("star")}Setting not found!`)
                    return msg.channel.send(responseEmbed)
                }
            }

            let [setChannel, setText, setRole] = [false, false, false]

            const newText = msg.content.match(/(?<=<#)(.*?)(?=>)/)?.[0] ?? ""
            const newRole = msg.content.replace(newText, "").match(/\d{10,}/)?.[0] ?? ""
            let newChannel = msg.content.replace(newRole, "").replace(/(<#)(.*?)(>)/, "")?.trim() ?? ""
            if (newChannel) {
                if (newChannel.match(/UC/)) {
                    newChannel = newChannel.match(/(UC|HC)(.*?)(?=\/|$)/)?.[0] ?? ""
                } else {
                    const search = await self.youtube.channels.get(newChannel)
                    newChannel = search?.id ?? ""
                }
            }

            if (newText) setText = true
            if (newRole) setRole = true
            if (newChannel) setChannel = true

            let description = ""
            const request = {} as any
            request.guild = message.guild?.id

            if (setChannel) {
                const found = channels.find((c: string) => c === newChannel)
                if (!found) channels.push(newChannel)
                const name = await self.getName(newChannel)
                request.channel = newChannel
                request.name = name
                description += `${discord.getEmoji("star")}Youtube channel set to [**${name}**](https://www.youtube.com/channel/${newChannel})!\n`
            }

            if (setText) {
                request.text = newText
                description += `${discord.getEmoji("star")}Text channel set to <#${newText}>!\n`
            }

            if (setRole) {
                request.mention = `<@&${newRole}>`
                description += `${discord.getEmoji("star")}Role mention set to <@&${newRole}>!\n`
            }

            if (setChannel && setText) {
                const text = message.guild?.channels.cache.get(newText) as TextChannel
                if (!text || text.type !== "text") return message.reply(`Invalid text channel ${discord.getEmoji("kannaFacepalm")}`)
                try {
                    const webhooks = await text.fetchWebhooks()
                    let webhook: Webhook
                    if (webhooks.size) {
                        webhook = webhooks.first()!
                    } else {
                        webhook = await text.createWebhook("Youtube", {avatar: discord.user!.displayAvatarURL({format: "png", dynamic: true})})
                    }
                    request.id = webhook.id
                    request.token = webhook.token
                    request.state = "On"
                    description += `${discord.getEmoji("star")}State is **on**!\n`
                } catch {
                    return message.reply(`I need the **Manage Webhooks** permission in order to send upload notifications ${discord.getEmoji("kannaFacepalm")}`)
                }
            } else {
                return message.reply(`Setting both the youtube channel and text channel is required.`)
            }
            if (!description) return message.reply(`No edits were made ${discord.getEmoji("kannaFacepalm")}`)
            await axios.post(`${config.imagesAPI}/youtube`, request)
            await sql.updateColumn("special channels", "yt channels", channels)
            responseEmbed
            .setDescription(description)
            return msg.channel.send(responseEmbed)

        }

        await embeds.createPrompt(ytPrompt)
    }
}
