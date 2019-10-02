import axios from "axios"
import {YouTube} from "better-youtube-api"
import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

let ytEmbeds: any = []
export default class Youtube extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public ytChannelEmbed = async (discord, youtube, channelLink: any) => {
        const channel = await youtube.getChannelByUrl(channelLink)
        const channelBanner = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=brandingSettings&id=${channel.id}&key=${process.env.GOOGLE_API_KEY}`)
        const keywords = channelBanner.data.items[0].brandingSettings.channel.keywords
        const channelBannerUrl = channelBanner.data.items[0].brandingSettings.image.bannerImageUrl
        const youtubeEmbed = discord.createEmbed()
        youtubeEmbed
        .setAuthor("youtube", "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png")
        .setTitle(`**${channel.name}** ${discord.getEmoji("kannaWave")}`)
        .setURL(channel.url)
        .setDescription(
        `${discord.getEmoji("star")}_Custom URL:_ **${channel.data.snippet.customUrl ? `https://youtube.com/c/${channel.data.snippet.customUrl}` : "None"}**\n` +
        `${discord.getEmoji("star")}_Keywords:_ ${keywords ? keywords : "None"}\n` +
        `${discord.getEmoji("star")}_Creation Date:_ **${discord.formatDate(channel.dateCreated)}**\n` +
        `${discord.getEmoji("star")}_Country:_ ${channel.country}\n` +
        `${discord.getEmoji("star")}_Subscribers:_ **${channel.subCount}** _Views:_ **${channel.views}**\n` +
        `${discord.getEmoji("star")}_Videos:_ **${channel.data.statistics.videoCount}**\n` +
        `${discord.getEmoji("star")}_About:_ ${discord.checkChar(channel.about, 1800, ".")}\n`
        )
        .setThumbnail(channel.profilePictures.high.url)
        .setImage(channelBannerUrl)
        ytEmbeds.push(youtubeEmbed)
    }

    public ytPlaylistEmbed = async (discord, youtube, playLink: any) => {
        const playlist = await youtube.getPlaylistByUrl(playLink)
        const ytChannel = await youtube.getChannel(playlist.creatorId)
        const videos = await playlist.fetchVideos(5)
        const videoArray: string[] = []
        for (let i = 0; i <= 5; i++) {
            if (!videos[i]) break
            videoArray.push(`**${videos[i].title}**\n`)
        }
        const youtubeEmbed = discord.createEmbed()
        youtubeEmbed
        .setAuthor("youtube", "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png")
        .setTitle(`**${playlist.title}** ${discord.getEmoji("kannaWave")}`)
        .setURL(`https://www.youtube.com/playlist?list=${playlist.id}`)
        .setDescription(
        `${discord.getEmoji("star")}_Channel:_ **${ytChannel.name}**\n` +
        `${discord.getEmoji("star")}_Creation Date:_ **${discord.formatDate(playlist.dateCreated)}**\n` +
        `${discord.getEmoji("star")}_Tags:_ ${playlist.tags ? playlist.tags : "None"}\n` +
        `${discord.getEmoji("star")}_Video Count:_ **${playlist.length}**\n` +
        `${discord.getEmoji("star")}_Description:_ ${playlist.data.snippet.description ? playlist.data.snippet.description : "None"}\n` +
        `${discord.getEmoji("star")}_Videos:_ ${videoArray.join(" ") ? videoArray.join(" ") : "None"}\n`
        )
        .setThumbnail(ytChannel.profilePictures.high ? ytChannel.profilePictures.high.url : ytChannel.profilePictures.medium.url)
        .setImage(playlist.thumbnails.maxres ? playlist.thumbnails.maxres.url : playlist.thumbnails.high.url)
        ytEmbeds.push(youtubeEmbed)
    }

    public ytVideoEmbed = async (discord, youtube, videoLink: any) => {
        const video = await youtube.getVideoByUrl(videoLink)
        const comments = await video.fetchComments(5)
        const commentArray: string[] = []
        for (let i = 0; i <= 5; i++) {
            if (!comments[i]) break
            commentArray.push(`**${comments[i].author.username}:** ${comments[i].text.displayed}\n`)
        }
        const ytChannel = await youtube.getChannel(video.channelId)
        const youtubeEmbed = discord.createEmbed()
        youtubeEmbed
        .setAuthor("youtube", "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png")
        .setTitle(`**${video.title}** ${discord.getEmoji("kannaWave")}`)
        .setURL(video.shortUrl)
        .setDescription(
        `${discord.getEmoji("star")}_Channel:_ **${ytChannel.name}**\n` +
        `${discord.getEmoji("star")}_Views:_ **${video.views}**\n` +
        `${discord.getEmoji("star")} ${discord.getEmoji("up")} **${video.likes}** ${discord.getEmoji("down")} **${video.dislikes}**\n` +
        `${discord.getEmoji("star")}_Date Published:_ **${discord.formatDate(video.datePublished)}**\n` +
        `${discord.getEmoji("star")}_Description:_ ${video.description ? discord.checkChar(video.description, 1500, ".") : "None"}\n` +
        `${discord.getEmoji("star")}_Comments:_ ${commentArray.join(" ") ? discord.checkChar(commentArray.join(" "), 200, " ") : "None"}\n`
        )
        .setThumbnail(ytChannel.profilePictures.high.url)
        .setImage(video.thumbnails.maxres ? video.thumbnails.maxres.url : video.thumbnails.high.url)
        ytEmbeds.push(youtubeEmbed)
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {

        const embeds = new Embeds(discord, message)
        const youtube = new YouTube(process.env.GOOGLE_API_KEY!)

        const msg = await message.channel.send(`**Searching youtube** ${discord.getEmoji("gabCircle")}`) as Message

        if (args[1].toLowerCase() === "channel") {
            ytEmbeds = []
            let channelLink = Functions.combineArgs(args, 2)
            if (!channelLink.startsWith("https")) {
                const channelResult = await youtube.searchChannels(channelLink)
                const length = channelResult.length < 10 ? channelResult.length : 10
                for (let i = 0; i < length; i++) {
                    if (!channelResult[i]) break
                    channelLink = channelResult[i].url
                    await this.ytChannelEmbed(discord, youtube, channelLink)
                }
                embeds.createReactionEmbed(ytEmbeds)
                msg.delete({timeout: 1000})
                return
            }
            await this.ytChannelEmbed(discord, youtube, channelLink)
            message.channel.send(ytEmbeds[0])
            msg.delete({timeout: 1000})
            return
        }

        if (args[1].toLowerCase() === "playlist") {
            ytEmbeds = []
            let playLink = Functions.combineArgs(args, 2)
            if (!playLink.startsWith("https")) {
                const playlistResult = await youtube.searchPlaylists(playLink)
                const length = playlistResult.length < 10 ? playlistResult.length : 10
                for (let i = 0; i < length; i++) {
                    if (!playlistResult[i]) break
                    playLink = `https://www.youtube.com/playlist?list=${playlistResult[i].id}`
                    await this.ytPlaylistEmbed(discord, youtube, playLink)
                }
                embeds.createReactionEmbed(ytEmbeds)
                msg.delete({timeout: 1000})
                return
            }
            await this.ytPlaylistEmbed(discord, youtube, playLink)
            message.channel.send(ytEmbeds[0])
            msg.delete({timeout: 1000})
            return
        }

        if (args[1].toLowerCase() === "video") {
            ytEmbeds = []
            let videoLink = Functions.combineArgs(args, 2)
            if (!videoLink.startsWith("https")) {
                const videoResult = await youtube.searchVideos(videoLink)
                for (let i = 0; i < videoResult.length; i++) {
                    if (!videoResult[i]) break
                    videoLink = videoResult[i].url
                    await this.ytVideoEmbed(discord, youtube, videoLink)
                }
                embeds.createReactionEmbed(ytEmbeds)
                msg.delete({timeout: 1000})
                return
            }
            await this.ytVideoEmbed(discord, youtube, videoLink)
            message.channel.send(ytEmbeds[0])
            msg.delete({timeout: 1000})
            return
        }
    }
}
