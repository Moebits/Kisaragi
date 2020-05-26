import {Message, MessageAttachment, MessageEmbed} from "discord.js"
import fs from "fs"
import Soundcloud from "soundcloud.ts"
import {Command} from "../../structures/Command"
import {Functions} from "../../structures/Functions"
import {Permission} from "../../structures/Permission"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Images} from "./../../structures/Images"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class SoundCloud extends Command {
    private user = null as any
    private playlist = null as any
    private track = null as any
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches for soundcloud tracks, users, and playlists or downloads them.",
            help:
            `
            _Note: The first search result is downloaded if you provide a query for the download._
            \`soundcloud query\` - Searches for tracks with the query
            \`soundcloud user query\` - Searches for users with the query
            \`soundcloud playlist query\` - Searches for playlists with the query
            \`soundcloud url\` - Fetches the resource from the url
            \`soundcloud download/dl url/query\` - Downloads the track from url/query
            `,
            examples:
            `
            \`=>soundcloud anime\`
            \`=>soundcloud user synthion\`
            \`=>soundcloud playlist kawaii\`
            \`=>soundcloud download virtual riot troublemaker\`
            `,
            aliases: ["sc"],
            random: "string",
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const audio = new Audio(discord, message)
        const images = new Images(discord, message)
        const perms = new Permission(discord, message)
        if (discord.checkMuted(message)) if (!perms.checkNSFW()) return

        if (args[1]?.match(/soundcloud.com/)) {
            const matches = args[1].replace("www.", "").replace("https://soundcloud.com", "").match(/(?<=\/)(.*?)(?=$|\/)/g)
            this.user = matches?.[0]
            this.track = matches?.[1]?.replace(/-/g, " ")
            if (this.track === "sets") this.playlist = matches?.[2]?.replace(/-/g, " ")
            if (this.track?.includes("search")) this.track = matches?.[1]?.replace("search?q=", "").replace(/%20/g, " ")
            const bad = ["tracks", "popular-tracks", "albums", "sets", "reposts"]
            if (bad.includes(this.track)) this.track = null
        }

        const soundcloud = new Soundcloud(process.env.SOUNDCLOUD_CLIENT_ID, process.env.SOUNDCLOUD_AUTH_TOKEN)

        if ((this.user && !this.track) || args[1] === "user") {
            const query = this.user || Functions.combineArgs(args, 2)
            if (!query) {
                return this.noQuery(embeds.createEmbed()
                .setAuthor("soundcloud", "https://i1.sndcdn.com/avatars-000681921569-32qkcn-t500x500.jpg", "https://soundcloud.com/")
                .setTitle(`**Soundcloud User** ${discord.getEmoji("karenSugoi")}`))
            }
            const soundcloudArray: MessageEmbed[] = []
            const users = await soundcloud.users.searchAlt(query)
            for (let i = 0; i < users.length; i++) {
                const soundcloudEmbed = embeds.createEmbed()
                soundcloudEmbed
                .setAuthor("soundcloud", "https://i1.sndcdn.com/avatars-000681921569-32qkcn-t500x500.jpg", "https://soundcloud.com/")
                .setTitle(`**Soundcloud User** ${discord.getEmoji("karenSugoi")}`)
                .setURL(users[i].permalink_url)
                .setImage(users[i].avatar_url)
                .setDescription(
                    `${discord.getEmoji("star")}_Name:_ **${users[i].username}**\n` +
                    `${discord.getEmoji("star")}_Tracks:_ **${users[i].track_count}**\n` +
                    `${discord.getEmoji("star")}_Following:_ **${users[i].followings_count}**\n`+
                    `${discord.getEmoji("star")}_Followers:_ **${users[i].followers_count}**\n` +
                    `${discord.getEmoji("star")}_Comments:_ **${users[i].comments_count}**\n` +
                    `${discord.getEmoji("star")}_Description:_ ${Functions.checkChar(users[i].description, 500, "")}`
                )
                soundcloudArray.push(soundcloudEmbed)
            }
            if (soundcloudArray.length === 1) {
                return message.channel.send(soundcloudArray[0])
            }
            return embeds.createReactionEmbed(soundcloudArray, true, true)
        }

        if (this.playlist || args[1] === "playlist") {
            const query = this.playlist || Functions.combineArgs(args, 2)
            if (!query) {
                return this.noQuery(embeds.createEmbed()
                .setAuthor("soundcloud", "https://i1.sndcdn.com/avatars-000681921569-32qkcn-t500x500.jpg", "https://soundcloud.com/")
                .setTitle(`**Soundcloud Playlist** ${discord.getEmoji("karenSugoi")}`))
            }
            const soundcloudArray: MessageEmbed[] = []
            const playlists = await soundcloud.playlists.searchAlt(query)
            for (let i = 0; i < playlists.length; i++) {
                const soundcloudEmbed = embeds.createEmbed()
                soundcloudEmbed
                .setAuthor("soundcloud", "https://i1.sndcdn.com/avatars-000681921569-32qkcn-t500x500.jpg", "https://soundcloud.com/")
                .setTitle(`**Soundcloud Playlist** ${discord.getEmoji("karenSugoi")}`)
                .setURL(playlists[i].permalink_url)
                .setImage(playlists[i].artwork_url!)
                .setDescription(
                    `${discord.getEmoji("star")}_Title:_ **${playlists[i].title}**\n` +
                    `${discord.getEmoji("star")}_Genre:_ **${playlists[i].genre ? playlists[i].genre : "None"}**\n` +
                    `${discord.getEmoji("star")}_Creation Date:_ **${Functions.formatDate(new Date(playlists[i].created_at))}**\n` +
                    `${discord.getEmoji("star")}_Tracks:_ **${playlists[i].track_count}**\n` +
                    `${discord.getEmoji("star")}_Duration:_ **${audio.parseSCDuration(playlists[i].duration)}**\n`+
                    `${discord.getEmoji("star")}_Description:_ ${Functions.checkChar((playlists[i].description ? playlists[i].description! : "None"), 500, "")}`
                )
                soundcloudArray.push(soundcloudEmbed)
            }
            if (soundcloudArray.length === 1) {
                return message.channel.send(soundcloudArray[0])
            }
            return embeds.createReactionEmbed(soundcloudArray, true, true)
        }

        if (args[1] === "download" || args[1]  === "dl") {
            const query = Functions.combineArgs(args, 2).trim()
            if (!query) {
                return this.noQuery(embeds.createEmbed()
                .setAuthor("soundcloud", "https://i1.sndcdn.com/avatars-000681921569-32qkcn-t500x500.jpg", "https://soundcloud.com/")
                .setTitle(`**Soundcloud Search** ${discord.getEmoji("karenSugoi")}`))
            }
            const rand = Math.floor(Math.random()*10000)
            const src = `../assets/misc/tracks/${rand}/`
            if (!fs.existsSync(src)) fs.mkdirSync(src, {recursive: true})
            let track: string
            if (/soundcloud.com/.test(query)) {
                track = query
            } else {
                track = await soundcloud.tracks.searchAlt(query).then((r) => r[0].permalink_url)
            }
            if (!track) {
                return this.invalidQuery(embeds.createEmbed()
                .setAuthor("soundcloud", "https://i1.sndcdn.com/avatars-000681921569-32qkcn-t500x500.jpg", "https://soundcloud.com/")
                .setTitle(`**Soundcloud Search** ${discord.getEmoji("karenSugoi")}`))
            }
            let file: string
            try {
                file = await soundcloud.util.downloadTrack(track, src)
            } catch {
                return message.channel.send(`Sorry but the Soundcloud token expired. Let the developer know with the \`feedback\` command.`)
            }
            const stats = fs.statSync(file)
            if (stats.size > 8000000) {
                const link = await images.upload(file)
                const soundcloudEmbed = embeds.createEmbed()
                soundcloudEmbed
                .setAuthor("soundcloud", "https://i1.sndcdn.com/avatars-000681921569-32qkcn-t500x500.jpg", "https://soundcloud.com/")
                .setURL(link)
                .setTitle(`**Soundcloud Download** ${discord.getEmoji("karenSugoi")}`)
                .setDescription(`${discord.getEmoji("star")}Downloaded the track! This file is too large for attachments. Download the file [**here**](${link}).\n`)
                await message.channel.send(soundcloudEmbed)
            } else {
                const attachment = new MessageAttachment(file)
                const soundcloudEmbed = embeds.createEmbed()
                soundcloudEmbed
                .setAuthor("soundcloud", "https://i1.sndcdn.com/avatars-000681921569-32qkcn-t500x500.jpg", "https://soundcloud.com/")
                .setTitle(`**Soundcloud Download** ${discord.getEmoji("karenSugoi")}`)
                .setDescription(`${discord.getEmoji("star")}Downloaded the track!\n`)
                await message.channel.send(soundcloudEmbed)
                await message.channel.send(attachment)
            }
            Functions.removeDirectory(src)
            return
        }

        const query = this.track || Functions.combineArgs(args, 1)
        if (!query) {
            return this.noQuery(embeds.createEmbed()
            .setAuthor("soundcloud", "https://i1.sndcdn.com/avatars-000681921569-32qkcn-t500x500.jpg", "https://soundcloud.com/")
            .setTitle(`**Soundcloud Search** ${discord.getEmoji("karenSugoi")}`))
        }
        const soundcloudArray: MessageEmbed[] = []
        const tracks = await soundcloud.tracks.searchAlt(query)
        for (let i = 0; i < tracks.length; i++) {
            const soundcloudEmbed = embeds.createEmbed()
            soundcloudEmbed
            .setAuthor("soundcloud", "https://i1.sndcdn.com/avatars-000681921569-32qkcn-t500x500.jpg", "https://soundcloud.com/")
            .setTitle(`**Soundcloud Search** ${discord.getEmoji("karenSugoi")}`)
            .setURL(tracks[i].permalink_url)
            .setThumbnail(tracks[i].user.avatar_url)
            .setImage(tracks[i].artwork_url)
            .setDescription(
                `${discord.getEmoji("star")}_Title:_ **${tracks[i].title}**\n` +
                `${discord.getEmoji("star")}_Artist:_ **${tracks[i].user.username}**\n` +
                `${discord.getEmoji("star")}_Genre:_ **${tracks[i].genre}**\n` +
                `${discord.getEmoji("star")}_Creation Date:_ **${Functions.formatDate(new Date(tracks[i].created_at))}**\n` +
                `${discord.getEmoji("star")}_Plays:_ **${tracks[i].playback_count}**\n` +
                `${discord.getEmoji("star")}_Likes:_ **${tracks[i].likes_count}**\n` +
                `${discord.getEmoji("star")}_Reposts:_ **${tracks[i].reposts_count}**\n` +
                `${discord.getEmoji("star")}_Comments:_ **${tracks[i].comment_count}**\n`+
                `${discord.getEmoji("star")}_Description:_ ${Functions.checkChar(tracks[i].description ?? "None", 500, "")}`
            )
            soundcloudArray.push(soundcloudEmbed)
        }
        if (soundcloudArray.length === 1) {
            return message.channel.send(soundcloudArray[0])
        }
        return embeds.createReactionEmbed(soundcloudArray, true, true)
    }
}
