import {Message, MessageEmbed} from "discord.js"
import fs from "fs"
import yt from "youtube.ts"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Images} from "./../../structures/Images"
import {Kisaragi} from "./../../structures/Kisaragi"

let ytEmbeds: MessageEmbed[] = []
export default class Youtube extends Command {
    private video = null as any
    private channel = null as any
    private playlist = null as any
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches for youtube videos, channels, and playlists.",
            help:
            `
            \`youtube query\` - Searches for youtube videos
            \`youtube channel query\` - Searches for youtube channels
            \`youtube playlist query\` - Searches for youtube playlists
            \`youtube video query\` - Searches for videos (long form)
            \`youtube download/dl query\` - Downloads the videos from the query
            \`youtube download/dl mp3 query\` - Downloads the videos as mp3 files
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
        const channelBanner = channel.brandingSettings.image.bannerImageUrl
        const keywords = channel.brandingSettings.channel.keywords
        const youtubeEmbed = embeds.createEmbed()
        youtubeEmbed
        .setAuthor("youtube", "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png")
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
        .setAuthor("youtube", "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png")
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
        .setAuthor("youtube", "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png")
        .setTitle(`**${video.snippet.title}** ${discord.getEmoji("kannaWave")}`)
        .setURL(`https://www.youtube.com/watch?=${video.id}`)
        .setDescription(
        `${discord.getEmoji("star")}_Channel:_ **${ytChannel.snippet.title}**\n` +
        `${discord.getEmoji("star")}_Views:_ **${video.statistics.viewCount}**\n` +
        `${discord.getEmoji("star")} ${discord.getEmoji("up")} **${video.statistics.likeCount}** ${discord.getEmoji("down")} **${video.statistics.dislikeCount}**\n` +
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
        const youtube = new yt(process.env.GOOGLE_API_KEY!)
        if (!args[1]) {
            return this.noQuery(embeds.createEmbed()
            .setAuthor("youtube", "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png")
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
                msg.delete({timeout: 1000})
                return
            }
            await this.ytChannelEmbed(discord, embeds, youtube, channelLink)
            message.channel.send(ytEmbeds[0])
            msg.delete({timeout: 1000})
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
                msg.delete({timeout: 1000})
                return
            }
            await this.ytPlaylistEmbed(discord, embeds, youtube, playLink)
            message.channel.send(ytEmbeds[0])
            msg.delete({timeout: 1000})
            return
        }

        if (args[1] === "download" || args[1] === "dl") {
            msg.delete({timeout: 1000})
            const rand = Math.floor(Math.random()*10000)
            if (args[2] === "mp3") {
                const query = Functions.combineArgs(args, 3).trim()
                const videos = await youtube.videos.search({q: query, maxResults: 10}).then((v) => v.items.map((i) => i.id.videoId))
                const src = `../assets/images/${rand}/`
                if (!fs.existsSync(src)) fs.mkdirSync(src)
                const dest = `../assets/images/${rand}/${query.replace(/ +/g, "_")}.zip`
                const msg2 = await message.channel.send(`**Downloading MP3 files, this will take awhile, please be patient** ${discord.getEmoji("gabCircle")}`) as Message
                let files: string[]
                try {
                    files = await youtube.util.downloadMP3s(videos, src)
                } catch {
                    msg2.delete({timeout: 1000})
                    return message.reply(`There was an error in processing this request. Try again later.`)
                }
                await Functions.createZip(files, dest)
                const link = await images.fileIOUpload(dest)
                const youtubeEmbed = embeds.createEmbed()
                youtubeEmbed
                .setAuthor("youtube", "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png")
                .setTitle(`**Youtube Download** ${discord.getEmoji("kannaWave")}`)
                .setDescription(
                    `${discord.getEmoji("star")}Downloaded **${files.length}** videos as mp3 files for the query **${query}**!\n` +
                    `${discord.getEmoji("star")}This file is too large for attachments. Please note that the following link **will get deleted after someone downloads it**.\n` +
                    link
                )
                await message.channel.send(youtubeEmbed)
                Functions.removeDirectory(src)
                msg2.delete({timeout: 1000})
                return
            } else {
                const query = Functions.combineArgs(args, 2).trim()
                const videos = await youtube.videos.search({q: query, maxResults: 10}).then((v) => v.items.map((i) => i.id.videoId))
                const src = `../assets/images/${rand}/`
                if (!fs.existsSync(src)) fs.mkdirSync(src)
                const dest = `../assets/images/${rand}/${query.replace(/ +/g, "_")}.zip`
                const msg2 = await message.channel.send(`**Downloading video files, this will take awhile, please be patient** ${discord.getEmoji("gabCircle")}`) as Message
                let files: string[]
                try {
                    files = await youtube.util.downloadVideos(videos, src)
                } catch {
                    msg2.delete({timeout: 1000})
                    return message.reply(`There was an error in processing this request. Try again later.`)
                }
                await Functions.createZip(files, dest)
                const link = await images.fileIOUpload(dest)
                const youtubeEmbed = embeds.createEmbed()
                youtubeEmbed
                .setAuthor("youtube", "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png")
                .setTitle(`**Youtube Download** ${discord.getEmoji("kannaWave")}`)
                .setDescription(
                    `${discord.getEmoji("star")}Downloaded **${files.length}** videos for the query **${query}**!\n` +
                    `${discord.getEmoji("star")}This file is too large for attachments. Please note that the following link **will get deleted after someone downloads it**.\n` +
                    link
                )
                await message.channel.send(youtubeEmbed)
                Functions.removeDirectory(src)
                msg2.delete({timeout: 1000})
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
                msg.delete({timeout: 1000})
                return
            }
        await this.ytVideoEmbed(discord, embeds, youtube, videoLink)
        message.channel.send(ytEmbeds[0])
        msg.delete({timeout: 1000})
        return
    }
}
