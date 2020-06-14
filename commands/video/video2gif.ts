import {Message, MessageAttachment} from "discord.js"
import fs from "fs"
import gifFrames from "gif-frames"
import path from "path"
import Youtube from "youtube.ts"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Audio} from "./../../structures/Audio"
import {CommandFunctions} from "./../../structures/CommandFunctions"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Images} from "./../../structures/Images"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Video} from "./../../structures/Video"

export default class Video2GIF extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Converts a portion of a video to a gif.",
            help:
            `
            _Note: The maximum length is 10 seconds._
            \`video2gif start length\` - Converts the last posted video
            \`video2gif start length url\` - Converts the linked video
            `,
            examples:
            `
            \`=>video2gif 30 3\`
            `,
            aliases: ["vgif", "vid2gif"],
            cooldown: 20
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const images = new Images(discord, message)
        const video = new Video(discord, message)
        const audio = new Audio(discord, message)
        const cmd = new CommandFunctions(discord, message)
        const perms = new Permission(discord, message)
        if (discord.checkMuted(message)) if (!perms.checkNSFW()) return
        const youtube = new Youtube(process.env.GOOGLE_API_KEY!)
        const regex = new RegExp(/.(mp4|avi|mov|mkv|flv|swf|wmv)/)
        let url: string | undefined
        const start = Functions.parseSeconds(args[1])
        const length = Number(args[2])
        if (Number.isNaN(start) || Number.isNaN(length)) return message.reply("You must provide a valid start/length time.")
        if (length > 10) return message.reply("The length is too long, keep it under 10 seconds...")
        console.log(start)
        console.log(length)
        if (args[3]) {
            url = args[3]
        } else {
            url = await discord.fetchLastAttachment(message, false, regex)
        }
        if (!url) return message.reply(`Could not find a video file ${discord.getEmoji("kannaCurious")}`)

        if (!fs.existsSync(path.join(__dirname, `../../videos`))) fs.mkdirSync(path.join(__dirname, `../../videos`), {recursive: true})
        let src = ""
        let dest = ""
        if (/youtube.com/.test(url) || /youtu.be/.test(url)) {
            return message.reply(`Sorry, you need to provide a discord attachment link. Downloading YouTube videos is against their TOS.`)
            /*
            const video = await youtube.videos.get(url)
            const title = video.snippet.title
            src = path.join(__dirname, `../../videos/`)
            dest = path.join(__dirname, `../../videos/transform/${title}.gif`)
            src = await youtube.util.downloadVideo(url, src)*/
        } else {
            src = path.join(__dirname, `../../videos/${path.basename(url)}`)
            dest = path.join(__dirname, `../../videos/transform/${path.basename(url).slice(0, -4)}.gif`)
            await images.download(url, src)
        }
        await video.video2Gif(start, length, src, dest)
        const videoEmbed = embeds.createEmbed()
        videoEmbed
        .setAuthor("ffmpeg", "https://cdn.iconscout.com/icon/free/png-512/ffmpeg-569477.png", "https://www.ffmpeg.org/")
        .setTitle(`**Video to GIF** ${discord.getEmoji("karenSugoi")}`)
        .setDescription(`${discord.getEmoji("star")}Converted the video to a gif! ${discord.getEmoji("chinoSmug")}`)

        const stats = fs.statSync(dest)
        if (stats.size > 8000000) {
            let link = await images.upload(dest)
            link = encodeURI(link)
            videoEmbed
            .setURL(link)
            .setDescription(
                `${discord.getEmoji("star")}Converted the video to a gif! ${discord.getEmoji("chinoSmug")}\n` +
                `This file is too large for attachments. Download the file [**here**](${link}).`
            )
            return message.channel.send(videoEmbed)
        }
        const attachment = new MessageAttachment(dest)
        await message.reply(`Converted the video to a gif! ${discord.getEmoji("chinoSmug")}`, attachment)
    }
}
