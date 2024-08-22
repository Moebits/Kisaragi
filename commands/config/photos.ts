import {Message, EmbedBuilder} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Permission} from "../../structures/Permission"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Photos extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Configures photo upload settings.",
            aliases: [],
            guildOnly: true,
            cooldown: 10,
            unlist: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        const embeds = new Embeds(discord, message)
        const sql = new SQLQuery(message)
        if (!await perms.checkAdmin()) return
        let channels = await sql.fetchColumn("guilds", "image channels")
        let folders = await sql.fetchColumn("guilds", "dropbox folders")
        let albums = await sql.fetchColumn("guilds", "google albums")
        const notify = await sql.fetchColumn("guilds", "notify toggle")
        const loading = message.channel.lastMessage
        loading?.delete()
        const input = Functions.combineArgs(args, 1)
        if (input.trim()) {
            message.content = input.trim()
            await photoPrompt(message)
            return
        }

        const step = 3.0
        const increment = Math.ceil((channels ? channels.length : 1) / step)
        const photosArray: EmbedBuilder[] = []
        for (let i = 0; i < increment; i++) {
            let description = ""
            for (let j = 0; j < step; j++) {
                if (channels || folders || albums) {
                    const value = (i*step)+j
                    if (!channels[value]) break
                    description += `**${value + 1} =>**\n` +
                    `${discord.getEmoji("star")}Channel: ${channels ? (channels[value] ? `<#${channels[value]}>` : "None") : "None"}\n` +
                    `${discord.getEmoji("star")}Dropbox Folder: **${folders ? (folders[value] ? folders[value] : "None") : "None"}**\n` +
                    `${discord.getEmoji("star")}Google Album: **${albums ? (albums[value] ? albums[value] : "None") : "None"}**\n`
                } else {
                    description = ""
                }
            }
            const photoEmbed = embeds.createEmbed()
            photoEmbed
            .setTitle(`**Photo Downloader/Uploader** ${discord.getEmoji("gabYes")}`)
            .setThumbnail(message.guild!.iconURL({extension: "png"})!)
            .setImage("https://i.imgur.com/AtAIFOb.png")
            .setDescription(
                "Automatically download and upload photos from a channel to dropbox/google photos!\n" +
                "\n" +
                "**Upload Notify** = Whether you will be notified whenever a photo is uploaded.\n" +
                "\n" +
                "__Current Settings__\n" +
                `${discord.getEmoji("star")}Upload notify is set to **${notify}**!\n` +
                description +
                "\n" +
                "__Edit Settings__\n" +
                `${discord.getEmoji("star")}**Mention a channel** to set the channel.\n` +
                `${discord.getEmoji("star")}**Type a name** to set the google album name.\n` +
                `${discord.getEmoji("star")}**Use brackets [name]** to set the dropbox folder name.\n` +
                `${discord.getEmoji("star")}Type **edit (setting number)** to edit a setting.\n` +
                `${discord.getEmoji("star")}Type **delete (setting number)** to delete a setting.\n` +
                `${discord.getEmoji("star")}Type **reset** to delete all settings.\n` +
                `${discord.getEmoji("star")}Type **cancel** to exit.\n`
            )
            photosArray.push(photoEmbed)
        }

        if (photosArray.length > 1) {
            embeds.createReactionEmbed(photosArray)
        } else {
            message.channel.send({embeds: [photosArray[0]]})
        }

        async function photoPrompt(msg: Message) {
            const responseEmbed = embeds.createEmbed()
            responseEmbed.setTitle(`**Photo Downloader/Uploader** ${discord.getEmoji("gabYes")}`)
            let [setChannel, setFolder, setAlbum, setNotify] = [false, false, false, false]
            if (!channels) channels = []
            if (!folders) folders = []
            if (!albums) albums = []
            if (msg.content.toLowerCase() === "cancel") {
                responseEmbed
                .setDescription(`${discord.getEmoji("star")}Canceled the prompt!`)
                msg.channel.send({embeds: [responseEmbed]})
                return
            }
            if (msg.content.toLowerCase() === "reset") {
                await sql.updateColumn("guilds", "image channels", null)
                await sql.updateColumn("guilds", "dropbox folders", null)
                await sql.updateColumn("guilds", "google albums", null)
                await sql.updateColumn("guilds", "notify toggle", "on")
                responseEmbed
                .setDescription(`${discord.getEmoji("star")}All settings were **reset**!`)
                msg.channel.send({embeds: [responseEmbed]})
                return
            }
            if (msg.content.toLowerCase().startsWith("delete")) {
                const newMsg = Number(msg.content.replace(/delete/g, "").trim())
                const num = newMsg - 1
                if (newMsg) {
                        channels[num] = ""
                        albums[num] = ""
                        folders[num] = ""
                        channels = channels.filter(Boolean)
                        albums = albums.filter(Boolean)
                        folders= folders.filter(Boolean)
                        await sql.updateColumn("guilds", "image channels", channels)
                        await sql.updateColumn("guilds", "google albums", albums)
                        await sql.updateColumn("guilds", "dropbox folders", folders)
                        return msg.channel.send({embeds: [responseEmbed.setDescription(`Setting **${newMsg}** was deleted!`)]})
                } else {
                    return msg.channel.send({embeds: [responseEmbed.setDescription("Setting not found!")]})
                }
            }
            if (msg.content.toLowerCase().startsWith("edit")) {
                const newMsg = msg.content.replace(/edit/g, "").trim().split(" ")
                const tempMsg = newMsg.slice(1).join(" ")
                const num = Number(newMsg[0]) - 1
                if (tempMsg) {
                    const tempChan = tempMsg.match(/\d+/g)?.[0] ?? ""
                    const tempAlbum = tempMsg.replace(/\d+/g, "").replace(/<#/g, "").replace(/>/g, "").replace(/(?<=\[)(.*?)(?=\])/g, "")
                    .replace(/\[/g, "").replace(/\]/g, "").replace(/notify/g, "").replace(/\s+/g, " ").trim()
                    const tempFolder = tempMsg.match(/(?<=\[)(.*?)(?=\])/g)?.[0] ?? ""
                    let editDesc = ""
                    if (tempChan) {
                        channels[num] = tempChan
                        await sql.updateColumn("guilds", "image channels", channels)
                        editDesc += `${discord.getEmoji("star")}Channel set to **${tempChan}**!\n`
                    }
                    if (tempFolder) {
                        folders[num] = tempFolder
                        await sql.updateColumn("guilds", "dropbox folders", folders)
                        editDesc += `${discord.getEmoji("star")}Dropbox folder set to **${tempFolder}**!\n`
                    }
                    if (tempAlbum) {
                        albums[num] = tempAlbum
                        await sql.updateColumn("guilds", "google albums", albums)
                        editDesc += `${discord.getEmoji("star")}Google album set to **${tempAlbum}**!\n`
                    }
                    return msg.channel.send({embeds: [responseEmbed.setDescription(editDesc)]})
                } else {
                    return msg.channel.send({embeds: [responseEmbed.setDescription("No edits specified!")]})
                }
            }
            const newChan = msg.content.match(/\d+/g)?.[0] ?? ""
            const newAlbum = msg.content.replace(/\d+/g, "").replace(/<#/g, "").replace(/>/g, "").replace(/(?<=\[)(.*?)(?=\])/g, "")
            .replace(/\[/g, "").replace(/\]/g, "").replace(/notify/g, "").replace(/\s+/g, " ").trim()
            const newFolder = msg.content.match(/(?<=\[)(.*?)(?=\])/g)?.[0] ?? ""
            if (msg.content.match(/notify/gi)) setNotify = true

            if (newChan) setChannel = true
            if (newFolder) setFolder = true
            if (newAlbum) setAlbum = true

            let description = ""

            if (setChannel) {
                channels.push(newChan)
                await sql.updateColumn("guilds", "image channels", channels)
                description += `${discord.getEmoji("star")}Channel set to <#${newChan}>!\n`
            }

            if (setFolder) {
                folders.push(newFolder)
                await sql.updateColumn("guilds", "dropbox folders", folders)
                description += `${discord.getEmoji("star")}Dropbox folder set to **${newFolder}**!\n`
            }

            if (setAlbum) {
                albums.push(newAlbum)
                await sql.updateColumn("guilds", "google albums", albums)
                description += `${discord.getEmoji("star")}Google album set to **${newAlbum}**!\n`
            }

            if (setNotify) {
                if (notify.join("") === "on") {
                    await sql.updateColumn("guilds", "notify toggle", "off")
                    description += `${discord.getEmoji("star")}Upload notify is **off**!\n`
                } else {
                    await sql.updateColumn("guilds", "notify toggle", "on")
                    description += `${discord.getEmoji("star")}Upload notify is **on**!\n`
                }
            }

            responseEmbed
            .setDescription(description)
            return msg.channel.send({embeds: [responseEmbed]})
        }

        await embeds.createPrompt(photoPrompt)
    }
}
