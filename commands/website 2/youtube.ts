import {Message, AttachmentBuilder, EmbedBuilder} from "discord.js"
import fs from "fs"
import yt from "youtube.ts"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Permission} from "../../structures/Permission"
import {Functions} from "./../../structures/Functions"
import {Images} from "./../../structures/Images"
import {Kisaragi} from "./../../structures/Kisaragi"
import {ProcBlock} from "./../../structures/ProcBlock"

let ytEmbeds: EmbedBuilder[] = []
export default class YoutubeCommand extends Command {
    private video = null as any
    private channel = null as any
    private playlist = null as any
    private readonly procBlock = new ProcBlock(this.discord, this.message)
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches for youtube videos, channels, and playlists.",
            help:
            `
            _Note: If a query is provided for the download, the first search result is downloaded._
            \`youtube query\` - Searches for youtube videos
            \`youtube channel query\` - Searches for youtube channels
            \`youtube playlist query\` - Searches for youtube playlists
            \`youtube video query\` - Searches for videos (long form)
            \`youtube download/dl url/query\` - Downloads the video from the url
            \`youtube download/dl mp3 url/query\` - Downloads and converts the video to an mp3 file
            `,
            examples:
            `
            \`=>youtube anime\`
            \`=>youtube channel tenpi\`
            \`=>youtube playlist kawaii music\`
            \`=>youtube download mp3 energy drink\`
            `,
            aliases: ["yt"],
            random: "string",
            cooldown: 10
        })
    }

    public ytChannelEmbed = async (discord: Kisaragi, embeds: Embeds, youtube: yt, channelLink: string) => {
        const channel = await youtube.channels.get(channelLink)
        const channelBanner = channel.brandingSettings.image.bannerExternalUrl
        const keywords = channel.brandingSettings.channel.keywords
        const youtubeEmbed = embeds.createEmbed()
        youtubeEmbed
        .setAuthor({name: "youtube", iconURL: "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png", url: "https://www.youtube.com/"})
        .setTitle(`**${channel.snippet.title}** ${discord.getEmoji("kannaWave")}`)
        .setURL(`https://www.youtube.com/channel/${channel.id}`)
        .setDescription(
        `${discord.getEmoji("star")}_Custom URL:_ **${channel.snippet.customUrl ? `https://youtube.com/c/${channel.snippet.customUrl}` : "None"}**\n` +
        `${discord.getEmoji("star")}_Keywords:_ ${keywords ? keywords : "None"}\n` +
        `${discord.getEmoji("star")}_Creation Date:_ **${Functions.formatDate(new Date(channel.snippet.publishedAt))}**\n` +
        `${discord.getEmoji("star")}_Country:_ ${channel.brandingSettings.channel.country}\n` +
        `${discord.getEmoji("star")}_Subscribers:_ **${channel.statistics.subscriberCount}**\n` +
        `${discord.getEmoji("star")}_Views:_ **${channel.statistics.viewCount}**\n` +
        `${discord.getEmoji("star")}_Videos:_ **${channel.statistics.videoCount}**\n` +
        `${discord.getEmoji("star")}_About:_ ${Functions.checkChar(channel.snippet.description, 1800, ".")}\n`
        )
        .setThumbnail(channel.snippet.thumbnails.high.url)
        .setImage(channelBanner)
        ytEmbeds.push(youtubeEmbed)
    }

    public ytPlaylistEmbed = async (discord: Kisaragi, embeds: Embeds, youtube: yt, playLink: string) => {
        const playlist = await youtube.playlists.get(playLink)
        const ytChannel = await youtube.channels.get(playlist.snippet.channelId)
        const items = await youtube.playlists.items(playLink)
        const videoArray: string[] = []
        for (let i = 0; i <= 5; i++) {
            if (!items.items[i]) break
            videoArray.push(`**${items.items[i].snippet.title}**\n`)
        }
        const youtubeEmbed = embeds.createEmbed()
        youtubeEmbed
        .setAuthor({name: "youtube", iconURL: "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png", url: "https://www.youtube.com/"})
        .setTitle(`**${playlist.snippet.title}** ${discord.getEmoji("kannaWave")}`)
        .setURL(`https://www.youtube.com/playlist?list=${playlist.id}`)
        .setDescription(
        `${discord.getEmoji("star")}_Channel:_ **${ytChannel.snippet.title}**\n` +
        `${discord.getEmoji("star")}_Creation Date:_ **${Functions.formatDate(new Date(playlist.snippet.publishedAt))}**\n` +
        `${discord.getEmoji("star")}_Tags:_ ${playlist.snippet.tags ? playlist.snippet.tags : "None"}\n` +
        `${discord.getEmoji("star")}_Video Count:_ **${items.pageInfo.totalResults}**\n` +
        `${discord.getEmoji("star")}_Description:_ ${playlist.snippet.description ? playlist.snippet.description : "None"}\n` +
        `${discord.getEmoji("star")}_Videos:_ ${videoArray.join(" ") ? videoArray.join(" ") : "None"}\n`
        )
        .setThumbnail(ytChannel.snippet.thumbnails.high.url)
        .setImage(playlist.snippet.thumbnails.maxres ? playlist.snippet.thumbnails.maxres.url : playlist.snippet.thumbnails.high.url)
        ytEmbeds.push(youtubeEmbed)
    }

    public ytVideoEmbed = async (discord: Kisaragi, embeds: Embeds, youtube: yt, videoLink: string) => {
        const video = await youtube.videos.get(videoLink)
        const comments = await youtube.videos.comments(videoLink)
        const commentArray: string[] = []
        for (let i = 0; i <= 5; i++) {
            if (!comments.items[i]) break
            commentArray.push(`**${comments.items[i].snippet.topLevelComment.snippet.authorDisplayName}:** ${comments.items[i].snippet.topLevelComment.snippet.textDisplay}\n`)
        }
        const ytChannel = await youtube.channels.get(video.snippet.channelId)
        const youtubeEmbed = embeds.createEmbed()
        youtubeEmbed
        .setAuthor({name: "youtube", iconURL: "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png", url: "https://www.youtube.com/"})
        .setTitle(`**${video.snippet.title}** ${discord.getEmoji("kannaWave")}`)
        .setURL(`https://www.youtube.com/watch?=${video.id}`)
        .setDescription(
        `${discord.getEmoji("star")}_Channel:_ **${ytChannel.snippet.title}**\n` +
        `${discord.getEmoji("star")}_Views:_ **${video.statistics.viewCount}**\n` +
        `${discord.getEmoji("star")} ${discord.getEmoji("thumbsUp")} **${video.statistics.likeCount}** ${discord.getEmoji("thumbsDown")} **${video.statistics.dislikeCount}**\n` +
        `${discord.getEmoji("star")}_Date Published:_ **${Functions.formatDate(new Date(video.snippet.publishedAt))}**\n` +
        `${discord.getEmoji("star")}_Description:_ ${video.snippet.description ? Functions.checkChar(video.snippet.description, 1500, ".") : "None"}\n` +
        `${discord.getEmoji("star")}_Comments:_ ${commentArray.join(" ") ? Functions.checkChar(commentArray.join(" "), 200, " ") : "None"}\n`
        )
        .setThumbnail(ytChannel.snippet.thumbnails.high.url)
        .setImage(video.snippet.thumbnails.maxres ? video.snippet.thumbnails.maxres.url : video.snippet.thumbnails.high.url)
        ytEmbeds.push(youtubeEmbed)
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const images = new Images(discord, message)
        const perms = new Permission(discord, message)
        if (discord.checkMuted(message)) if (!perms.checkNSFW()) return
        const youtube = new yt(process.env.GOOGLE_API_KEY!)
        if (!args[1]) {
            return this.noQuery(embeds.createEmbed()
            .setAuthor({name: "youtube", iconURL: "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png", url: "https://www.youtube.com/"})
            .setTitle(`**Youtube Search** ${discord.getEmoji("kannaWave")}`))
        }

        if (args[1].match(/youtube.com/) || args[1].match(/youtube/)) {
            if (args[1].includes("youtube.com/channel") || args[1].includes("youtube.com/c")) {
                this.channel = args[1]
            } else if (args[1].includes("youtube.com/watch") || args[1].includes("youtu.be")) {
                this.video = args[1]
            } else if (args[1].includes("youtube.com/playlist")) {
                this.playlist = args[1]
            }
        }

        const msg = await message.channel.send(`**Searching youtube** ${discord.getEmoji("gabCircle")}`) as Message

        if (this.channel || args[1].toLowerCase() === "channel") {
            ytEmbeds = []
            let channelLink = this.channel || Functions.combineArgs(args, 2)
            if (!channelLink.startsWith("https")) {
                const channelResult = await youtube.channels.search({q: channelLink, maxResults: 20})
                const length = channelResult.items.length < 10 ? channelResult.items.length : 10
                for (let i = 0; i < length; i++) {
                    if (!channelResult.items[i]) break
                    channelLink = channelResult.items[i].id.channelId
                    try {
                        await this.ytChannelEmbed(discord, embeds, youtube, channelLink)
                    } catch {
                        continue
                    }
                }
                if (ytEmbeds.length === 0) return this.invalidQuery(embeds.createEmbed())
                embeds.createReactionEmbed(ytEmbeds, true, true)
                setTimeout(() => msg.delete(), 1000)
                return
            }
            await this.ytChannelEmbed(discord, embeds, youtube, channelLink)
            message.channel.send({embeds: [ytEmbeds[0]]})
            setTimeout(() => msg.delete(), 1000)
            return
        }

        if (this.playlist || args[1].toLowerCase() === "playlist") {
            ytEmbeds = []
            let playLink = this.playlist || Functions.combineArgs(args, 2)
            if (!playLink.startsWith("https")) {
                const playlistResult = await youtube.playlists.search({q: playLink, maxResults: 20})
                const length = playlistResult.items.length < 10 ? playlistResult.items.length : 10
                for (let i = 0; i < length; i++) {
                    if (!playlistResult.items[i]) break
                    playLink = playlistResult.items[i].id.playlistId
                    try {
                        await this.ytPlaylistEmbed(discord, embeds, youtube, playLink)
                    } catch {
                        continue
                    }

                }
                if (ytEmbeds.length === 0) return this.invalidQuery(embeds.createEmbed())
                embeds.createReactionEmbed(ytEmbeds, true, true)
                setTimeout(() => msg.delete(), 1000)
                return
            }
            await this.ytPlaylistEmbed(discord, embeds, youtube, playLink)
            message.channel.send({embeds: [ytEmbeds[0]]})
            setTimeout(() => msg.delete(), 1000)
            return
        }

        if (args[1] === "download" || args[1] === "dl") {
            setTimeout(() => msg.delete(), 1000)
            if (discord.checkMuted(message)) return message.reply(`Sorry, this command was disabled, downloading YouTube videos is against their TOS.`)
            if (this.procBlock.getProcBlock()) return message.reply(`Please wait until the current download finishes ${discord.getEmoji("sagiriBleh")}`)
            this.procBlock.setProcBlock()
            const rand = Math.floor(Math.random()*10000)
            if (args[2] === "mp3") {
                const query = Functions.combineArgs(args, 3).trim()
                let video: string
                if (/youtube.com/.test(query) || /youtu.be/.test(query)) {
                    video = query
                } else {
                    video = await youtube.videos.search({q: query, maxResults: 1}).then((v) => v.items.map((i) => i.id.videoId))?.[0]
                }
                if (!video) {
                    return this.invalidQuery(embeds.createEmbed()
                    .setAuthor({name: "youtube", iconURL: "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png", url: "https://www.youtube.com/"})
                    .setTitle(`**Youtube Download** ${discord.getEmoji("kannaWave")}`))
                }
                const src = `../assets/misc/videos/${rand}/`
                if (!fs.existsSync(src)) fs.mkdirSync(src, {recursive: true})
                const msg2 = await message.channel.send(`**Downloading MP3, this will take awhile, please be patient** ${discord.getEmoji("gabCircle")}`) as Message
                let file: string
                try {
                    file = await youtube.util.downloadMP3(video, src)
                } catch {
                    setTimeout(() => msg2.delete(), 1000)
                    return message.reply(`This request was rate limited. Try again later.`)
                }
                const stats = fs.statSync(file)
                if (stats.size > 8000000) {
                    let link = await images.upload(file)
                    link = encodeURI(link).replace("http", "https")
                    const youtubeEmbed = embeds.createEmbed()
                    youtubeEmbed
                    .setAuthor({name: "youtube", iconURL: "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png", url: "https://www.youtube.com/"})
                    .setTitle(`**Youtube Download** ${discord.getEmoji("kannaWave")}`)
                    .setURL(link)
                    .setDescription(`${discord.getEmoji("star")}Converted the video to an mp3 file! This file is too large for attachments. Download the file [**here**](${link}).\n`)
                    await message.channel.send({embeds: [youtubeEmbed]})
                } else {
                    const attachment = new AttachmentBuilder(file)
                    const youtubeEmbed = embeds.createEmbed()
                    youtubeEmbed
                    .setAuthor({name: "youtube", iconURL: "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png", url: "https://www.youtube.com/"})
                    .setTitle(`**Youtube Download** ${discord.getEmoji("kannaWave")}`)
                    .setDescription(`${discord.getEmoji("star")}Converted the video to an mp3 file!`)
                    await message.channel.send({embeds: [youtubeEmbed]})
                    await message.channel.send({files: [attachment]})
                }
                Functions.removeDirectory(src)
                setTimeout(() => msg2.delete(), 1000)
                this.procBlock.setProcBlock(true)
                return
            } else {
                return message.reply(`Sorry, this command was disabled, downloading YouTube videos is against their TOS.`)
                const query = Functions.combineArgs(args, 2).trim()
                let video: string
                if (/youtube.com/.test(query) || /youtu.be/.test(query)) {
                    video = query
                } else {
                    video = await youtube.videos.search({q: query, maxResults: 1}).then((v) => v.items.map((i) => i.id.videoId))?.[0]
                }
                if (!video) {
                    return this.invalidQuery(embeds.createEmbed()
                    .setAuthor({name: "youtube", iconURL: "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png", url: "https://www.youtube.com/"})
                    .setTitle(`**Youtube Download** ${discord.getEmoji("kannaWave")}`))
                }
                const src = `../assets/misc/videos/${rand}/`
                if (!fs.existsSync(src)) fs.mkdirSync(src, {recursive: true})
                const msg2 = await message.channel.send(`**Downloading video, this will take awhile, please be patient** ${discord.getEmoji("gabCircle")}`) as Message
                let file: string
                try {
                    file = await youtube.util.downloadVideo(video, src)
                } catch {
                    setTimeout(() => msg2.delete(), 1000)
                    return message.reply(`This request was rate limited. Try again later.`)
                }
                let link = await images.upload(file)
                link = encodeURI(link).replace("http", "https")
                const youtubeEmbed = embeds.createEmbed()
                youtubeEmbed
                .setAuthor({name: "youtube", iconURL: "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png", url: "https://www.youtube.com/"})
                .setURL(link)
                .setTitle(`**Youtube Download** ${discord.getEmoji("kannaWave")}`)
                .setDescription(
                    `${discord.getEmoji("star")}Downloaded the video! This file is too large for attachments. Download the file [**here**](${link}).\n`
                )
                await message.channel.send({embeds: [youtubeEmbed]})
                Functions.removeDirectory(src)
                setTimeout(() => msg2.delete(), 1000)
                this.procBlock.setProcBlock(true)
                return
            }
        }

        ytEmbeds = []
        let videoLink = this.video || Functions.combineArgs(args, 1)
        if (args[1].toLowerCase() === "video") videoLink = Functions.combineArgs(args, 2)
        if (!videoLink.startsWith("https")) {
                const videoResult = await youtube.videos.search({q: videoLink, maxResults: 20})
                for (let i = 0; i < videoResult.items.length; i++) {
                    if (!videoResult.items[i]) break
                    videoLink = videoResult.items[i].id.videoId
                    try {
                        await this.ytVideoEmbed(discord, embeds, youtube, videoLink)
                    } catch {
                        continue
                    }

                }
                if (ytEmbeds.length === 0) return this.invalidQuery(embeds.createEmbed())
                embeds.createReactionEmbed(ytEmbeds, true, true)
                setTimeout(() => msg.delete(), 1000)
                return
            }
        await this.ytVideoEmbed(discord, embeds, youtube, videoLink)
        message.channel.send({embeds: [ytEmbeds[0]]})
        setTimeout(() => msg.delete(), 1000)
        return
    }
}
