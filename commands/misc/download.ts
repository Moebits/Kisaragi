import {Message, MessageAttachment, TextChannel} from "discord.js"
import fs from "fs"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Images} from "./../../structures/Images"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Download extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Downloads images and gifs from a text channel.",
            help:
            `
            _Note:_ Gifs are excluded by default, but you can include them by adding "gif".
            The number must be between 1 and 1000, default is 300.
            \`download num?\` - Downloads the number of images in the text channel
            \`download gif num?\` - Includes gifs
            \`download id num?\` - Starts downloading from the message id
            \`download id gif num?\` - Includes gifs
            `,
            examples:
            `
            \`=>download 100\`
            \`=>download gif\`
            \`=>download gif 100\`
            `,
            aliases: ["dl"],
            cooldown: 10
        })
    }

    public sendDownload = async (name: string, images: string[], last?: string | null) => {
        name = name.trim().replace(/ +/g, "_")
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const i = new Images(discord, message)
        if (!images[0]) {
            const downloadEmbed = embeds.createEmbed()
            downloadEmbed
            .setAuthor("download", "https://outdoortycoon.com/wp-content/uploads/2017/01/Download-Icon-Wenzel.png")
            .setTitle(`**Image Downloader** ${discord.getEmoji("tohruSmug")}`)
            .setDescription(`${discord.getEmoji("star")}Could not find any images. By default I only search the last **300** messages from the current message, or from a message id if provided. ${last ? `To continue from where this search left off, run the command \`download ${last}\`.` : "There are no more messages left in this channel!"}`)
            return message.channel.send(downloadEmbed)
        }
        const rand = Math.floor(Math.random()*10000)
        const src = `../assets/images/${rand}/`
        if (!fs.existsSync(src)) fs.mkdirSync(src)
        const dest = `../assets/images/${rand}/${name}.zip`
        await i.downloadImages(images, src)
        const downloads = fs.readdirSync(src).map((m) => src + m)
        await Functions.createZip(downloads, dest)
        const stats = fs.statSync(dest)
        if (stats.size > 8000000) {
            const link = await i.fileIOUpload(dest)
            const downloadEmbed = embeds.createEmbed()
            downloadEmbed
            .setAuthor("download", "https://outdoortycoon.com/wp-content/uploads/2017/01/Download-Icon-Wenzel.png")
            .setTitle(`**Image Downloader** ${discord.getEmoji("tohruSmug")}`)
            .setDescription(
                `${discord.getEmoji("star")}Downloaded **${images.length}** images from this text channel!\n` +
                `${discord.getEmoji("star")}This file is too large for attachments. Please note that the following link **will get deleted after someone downloads it**.\n` +
                link
            )
            await message.channel.send(downloadEmbed)
        } else {
            const attachment = new MessageAttachment(dest, `${name}.zip`)
            const lastText = last ? `There are still more messages left in this text channel. To continue from where this search left off, run the command \`download ${last}\`.` : `There are no more images left after this. Congrats!`
            const downloadEmbed = embeds.createEmbed()
            downloadEmbed
            .setAuthor("download", "https://outdoortycoon.com/wp-content/uploads/2017/01/Download-Icon-Wenzel.png")
            .setTitle(`**Image Downloader** ${discord.getEmoji("tohruSmug")}`)
            .setDescription(
                `${discord.getEmoji("star")}Downloaded **${images.length}** images from this text channel!\n` +
                lastText
            )
            await message.channel.send(downloadEmbed)
            await message.channel.send(attachment)
        }
        Functions.removeDirectory(src)
        return
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const images = new Images(discord, message)
        const name = message.channel instanceof TextChannel ? message.channel.name : message.author.username + "_dm"
        let attachments: string[] = []
        let last: string | null = null
        let amount = 300

        const loading = message.channel.lastMessage
        loading?.delete()
        const rep = await message.channel.send(`**Searching the messages in this channel, please wait** ${discord.getEmoji("gabCircle")}`)

        if (args[1] === "gif") {
            if (Number(args[2]) && Number(args[2]) > 0 && Number(args[2]) <= 1000) amount = Number(args[2])
            const result = await images.fetchChannelAttachments(message.channel, amount+2, true)
            attachments = result.attachments
            last = result.last
        } else if (args[1]?.match(/\d{15,}/)) {
            const id = args[1]?.match(/\d{15,}/)?.[0]
            if (args[2] === "gif") {
                if (Number(args[3]) && Number(args[3]) > 0 && Number(args[3]) <= 1000) amount = Number(args[3])
                const result = await images.fetchChannelAttachments(message.channel, amount+2, true, id)
                attachments = result.attachments
                last = result.last
            } else {
                if (Number(args[2]) && Number(args[2]) > 0 && Number(args[2]) <= 1000) amount = Number(args[2])
                const result = await images.fetchChannelAttachments(message.channel, amount+2, false, id)
                attachments = result.attachments
                last = result.last
            }
        } else {
            if (Number(args[1]) && Number(args[1]) > 0 && Number(args[1]) <= 1000) amount = Number(args[1])
            const result = await images.fetchChannelAttachments(message.channel, amount+2)
            attachments = result.attachments
            last = result.last
        }
        if (rep) rep.delete()
        const rep2 = await message.channel.send(`**Downloading the images, please wait** ${discord.getEmoji("gabCircle")}`)
        await this.sendDownload(name, attachments, last)
        if (rep2) rep2.delete()
        return
    }
}
