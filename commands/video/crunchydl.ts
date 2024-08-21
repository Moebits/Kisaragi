import axios from "axios"
// import crunchyroll from "crunchyroll.ts"
import {Message, MessageAttachment} from "discord.js"
import ffmpeg from "fluent-ffmpeg"
import fs from "fs"
import gifFrames from "gif-frames"
import path from "path"
import {Audio} from "../../structures/Audio"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Images} from "../../structures/Images"
import {Kisaragi} from "../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"
import {ProcBlock} from "../../structures/ProcBlock"
import {Video} from "../../structures/Video"

export default class CrunchyDL extends Command {
    private readonly procBlock = new ProcBlock(this.discord, this.message)
    private readonly headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36"}
    public readonly baseURL = "https://api.crunchyroll.com/"
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Downloads the subs of an anime episode from Crunchyroll.",
            help:
            `
            \`crunchydl query epNum?/url\` - Downloads the subs of the anime episode by url/query.
            `,
            examples:
            `
            \`=>crunchydl dragon maid 1\`
            \`=>crunchydl konosuba 6\`
            \`=>crunchydl kiniro mosaic 5\`
            `,
            aliases: ["animedl", "animedownload", "crunchydownload"],
            cooldown: 200,
            nsfw: true
        })
    }

    public downloadEpisode = async (stream: string, dest: string, resolution?: number, skipConversion?: boolean) => {
        this.procBlock.setGlobalProcBlock()
        if (!resolution) resolution = 480
        const manifest = await axios.get(stream).then((r) => r.data)
        const m3u8 = Functions.parsem3u8(manifest)
        let playlist = m3u8.playlists.find((p: any) => p.attributes.RESOLUTION.height === resolution)
        if (!playlist) playlist = m3u8.playlists.find((p: any) => p.attributes.RESOLUTION.height === 720)
        if (!playlist) playlist = m3u8.playlists.find((p: any) => p.attributes.RESOLUTION.height === 480)
        if (skipConversion) return playlist.uri
        await new Promise((resolve) => {
            ffmpeg(playlist.uri).outputOptions(["-vcodec", "copy", "-acodec", "copy"]).save(dest)
            .on("end", () => resolve())
        })
        this.procBlock.setGlobalProcBlock(true)
    }

    public getVilos = async (url: string) => {
        try {
        const html = await axios.get(url, {headers: {...this.headers}}).then((r) => r.data)
        const vilos = JSON.parse(html.match(/(?<=vilos.config.media = )(.*?)(?=;)/)?.[0])
        const title = vilos.metadata.title
        const series = vilos.metadata.up_next.series_title
        const thumbnail = vilos.thumbnail.url
        let dub = vilos.streams.filter((s) => {
            if (s.audio_lang === "enUS") {
                return true
            } else {
                return false
            }
        })
        let sub = vilos.streams.filter((s) => {
            if (s.audio_lang === "jaJP" && s.hardsub_lang === "enUS") {
                return true
            } else {
                return false
            }
        })
        const subtitles = vilos.subtitles.filter((s) => {
            if (s.language === "enUS") {
                return true
            } else {
                return false
            }
        })
        if (dub[0]) dub = dub.filter((d) => d.format === "adaptive_hls")
        if (sub[0]) sub = sub.filter((s) => s.format === "adaptive_hls")
        const obj = {} as any
        obj.dub = dub
        obj.sub = sub
        obj.subtitles = subtitles
        obj.title = title.replace(/\//g, "").replace(/\?/g, "").replace(/\\/g, "")
        obj.series = series.replace(/\//g, "").replace(/\?/g, "").replace(/\\/g, "")
        obj.thumbnail = thumbnail
        return obj
        } catch {
            return Promise.reject("Error")
        }
    }

    public getEpisode = async (mediaID: string, sessionID: string) => {
        const result = await axios.get(`${this.baseURL}info.0.json`, {params: {session_id: sessionID, media_id: mediaID, locale: "enUS"}})
        return result.data
    }

    public getEpisodeLinks = async (seriesLink: string) => {
        const html = await axios.get(seriesLink, {headers: this.headers}).then((r) => r.data)
        let links = html.match(/(?<=a href=")(.*?)(?=" title=")/gm)
        links = Functions.removeDuplicates(links)
        return links
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const images = new Images(discord, message)
        const video = new Video(discord, message)
        const perms = new Permission(discord, message)
        // if (this.procBlock.getGlobalProcBlock()) return message.reply(`Sorry, someone is already downloading a video. I can only handle one request at a time ${discord.getEmoji("hanaDesires")}`)
        let input = Functions.combineArgs(args, 1)
        let setMP3 = false
        let setDub = false
        let setSub = false
        let url = ""
        if (/sub/.test(input)) {
            input = input.replace("sub", "").trim()
            setSub = true
        }
        if (/dub/.test(input)) {
            input = input.replace("dub", "").trim()
            setDub = true
        }
        if (/mp3/.test(input)) {
            input = input.replace("mp3", "").trim()
            setMP3 = true
        }
        if (/crunchyroll/.test(input)) {
            url = input
        } else {
            let epNum = 1
            if (/\d+/.test(input)) {
                epNum = Number(input.match(/\d+/)?.[0])
                input = input.replace(/\d+/, "")
            }
            url = await crunchyroll.episode.get(input).then((e) => e.url)
        }
        // const unblockURL = "https://api2.cr-unblocker.com/start_session"
        // const sess = await axios.get(unblockURL, {headers: this.headers}).then((r) => r.data)
        // const sessionID = sess.data.session_id
        let vilos: any
        try {
            vilos = await this.getVilos(url)
        } catch {
            return message.reply(`Sorry, there was an error with processing this request. Try again later.`)
        }
        const folder = path.join(__dirname, `../../../assets/misc/videos/${vilos.series}`)
        if (!fs.existsSync(folder)) fs.mkdirSync(folder, {recursive: true})
        const dest = path.join(folder, `./${vilos.title}.mp4`)
        const episodeNum = Number(url.match(/(?<=episode-)(.*?)(?=-)/)?.[0])
        let attachment = null as any
        const crunchyEmbed = embeds.createEmbed()
        crunchyEmbed
        .setAuthor("crunchyroll", "https://www.groovypost.com/wp-content/uploads/2013/06/Crunchyroll-Apple-TV.png")
        .setTitle(`**Crunchyroll Download** ${discord.getEmoji("himeHappy")}`)
        .setImage(vilos.thumbnail)
        const msg = await message.channel.send(`**Downloading this anime episode, this is going to take awhile...** ${discord.getEmoji("gabCircle")}`)
        if (setDub) {
            if (!perms.checkBotDev()) return
            if (!vilos.dub[0]) {
                await msg.delete()
                return message.reply("It looks like this anime doesn't have a dub up on Crunchyroll.")
            }
            const fileLink = await this.downloadEpisode(vilos.dub[0].url, dest, 1080, true)
            // const fileLink = await images.upload(dest)
            crunchyEmbed
            .setURL(url)
            .setDescription(
                `${discord.getEmoji("star")}_Anime:_ **${vilos.series}**\n` +
                `${discord.getEmoji("star")}_Episode:_ **${vilos.title} (${episodeNum}) (Dub)**\n` +
                `Fetched this video stream! You can convert m3u8 files with [**VLC**](https://www.videolan.org/vlc/index.html) or [**FFmpeg**](https://www.ffmpeg.org/). Since this is a very processing heavy task, you must do it yourself. Download the file [**here**](${fileLink})`
            )
        } else if (setMP3) {
            return message.reply(`The mp3 sub command was disabled.`)
            if (!vilos.sub[0]) {
                await msg.delete()
                return message.reply("It looks like this anime isn't on Crunchyroll.")
            }
            await this.downloadEpisode(vilos.sub[0].url, dest)
            let mp3Dest = path.join(__dirname, `../../tracks/${vilos.title}.mp3`)
            mp3Dest = await video.extractAudio(dest, mp3Dest)
            const originalLink = await images.upload(dest)
            const stats = fs.statSync(mp3Dest)
            if (stats.size > 8000000) {
                const fileLink = await images.upload(mp3Dest)
                crunchyEmbed
                .setURL(url)
                .setDescription(
                    `${discord.getEmoji("star")}_Anime:_ **${vilos.series}**\n` +
                    `${discord.getEmoji("star")}_Episode:_ **${vilos.title} (${episodeNum})**\n` +
                    `Downloaded this episode as an mp3! The file is way too massive for attachments. Download it [**here**](${fileLink}).\n` +
                    `Get the original file [**here**](${originalLink}).`
                )
            } else {
                attachment = new MessageAttachment(mp3Dest)
                crunchyEmbed
                .setURL(url)
                .setDescription(
                    `${discord.getEmoji("star")}_Anime:_ **${vilos.series}**\n` +
                    `${discord.getEmoji("star")}_Episode:_ **${vilos.title} (${episodeNum})**\n` +
                    `Downloaded this episode as an mp3! Get the original file [**here**](${originalLink})`
                )
            }
        } else if (setSub) {
            if (!perms.checkBotDev()) return
            if (!vilos.sub[0]) {
                await msg.delete()
                return message.reply("It looks like this anime isn't on Crunchyroll.")
            }
            const fileLink = await this.downloadEpisode(vilos.sub[0].url, dest, 720, true)
            // const fileLink = await images.upload(dest)
            crunchyEmbed
            .setURL(url)
            .setDescription(
                `${discord.getEmoji("star")}_Anime:_ **${vilos.series}**\n` +
                `${discord.getEmoji("star")}_Episode:_ **${vilos.title} (${episodeNum})**\n` +
                `Fetched this video stream! You can convert m3u8 files with [**VLC**](https://www.videolan.org/vlc/index.html) or [**FFmpeg**](https://www.ffmpeg.org/). Since this is a very processing heavy task, you must do it yourself. Download the file [**here**](${fileLink})`
            )
        } else {
            const data = await axios.get(vilos.subtitles[0].url, {headers: this.headers}).then((r) => r.data)
            const subDest = path.join(__dirname, `../../../assets/misc/dump/${vilos.title}.txt`)
            fs.writeFileSync(subDest, data)
            attachment = new MessageAttachment(subDest)
            crunchyEmbed
            .setURL(url)
            .setDescription(
                `${discord.getEmoji("star")}_Anime:_ **${vilos.series}**\n` +
                `${discord.getEmoji("star")}_Episode:_ **${vilos.title} (${episodeNum})**\n` +
                `Downloaded the subs for this episode!`
            )
        }
        await msg.delete()
        await message.channel.send(crunchyEmbed)
        if (attachment) await message.channel.send(attachment)
        Functions.removeDirectory(folder)
    }
}
