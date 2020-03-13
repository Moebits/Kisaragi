import axios from "axios"
import {Collection, Message, MessageAttachment, MessageEmbed, MessageReaction, StreamDispatcher, User, VoiceConnection} from "discord.js"
import fs from "fs"
import path from "path"
import Soundcloud, {SoundCloudTrack} from "soundcloud.ts"
// @ts-ignore
import Youtube from "youtube.ts"
import * as defaults from "./../assets/json/defaultSongs.json"
import {AudioEffects} from "./AudioEffects"
import {Embeds} from "./Embeds"
import {Functions} from "./Functions"
import {Kisaragi} from "./Kisaragi"
import {Video} from "./Video"

const numMap = {
    1: [0, 3, 6, 9, 12, 15],
    2: [1, 4, 7, 10, 13, 16],
    3: [2, 5, 8, 11, 14, 17]
}

const queues = new Collection()

export class Audio {
    private readonly headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}
    private readonly fx = new AudioEffects(this.discord, this.message)
    private readonly video = new Video(this.discord, this.message)
    private readonly youtube = new Youtube(process.env.GOOGLE_API_KEY!)
    private readonly soundcloud = new Soundcloud(process.env.SOUNDCLOUD_CLIENT_ID)
    private readonly embeds = new Embeds(this.discord, this.message)
    constructor(private readonly discord: Kisaragi, private readonly message: Message) {}

    public speed = async (filepath: string, factor: number, pitch?: boolean, dl?: boolean) => {
        const queue = this.getQueue() as any
        if (!pitch) pitch = false
        const filename = path.basename(filepath.replace("_speed", "")).slice(0, -4)
        const fileDest = `./tracks/transform/${filename}_speed`
        const mp3File = await this.fx.speed(factor, pitch, filepath, fileDest)
        if (queue[0]) queue[0].file = mp3File
        if (dl) {
            return this.fx.downloadEffect("speed", mp3File)
        } else {
            return this.play(mp3File, this.time())
        }
    }

    public pitch = async (filepath: string, semitones: number, dl?: boolean) => {
        const queue = this.getQueue() as any
        const filename = path.basename(filepath.replace("_pitch", "")).slice(0, -4)
        const fileDest = `./tracks/transform/${filename}_pitch`
        const mp3File = await this.fx.pitch(semitones, filepath, fileDest)
        if (queue[0]) queue[0].file = mp3File
        if (dl) {
            return this.fx.downloadEffect("pitch", mp3File)
        } else {
            return this.play(mp3File, this.time())
        }
    }

    public reverse = async (filepath: string, dl?: boolean) => {
        const queue = this.getQueue() as any
        const filename = path.basename(filepath.replace("_reverse", "")).slice(0, -4)
        const mp3Dest = `./tracks/transform/${filename}_reverse`
        const mp3File = await this.fx.reverse(filepath, mp3Dest)
        if (queue[0]) queue[0].file = mp3File
        if (queue[0]) queue[0].reverse = queue[0].reverse === true ? false : true
        if (dl) {
            return this.fx.downloadEffect("reverse", mp3File)
        } else {
            return this.play(mp3File, this.time())
        }
    }

    public reverb = async (filepath: string, reverb: number, damping: number, room: number, stereo: number, preDelay: number, wetGain: number, reverse: boolean, dl?: boolean) => {
        const filename = path.basename(filepath.replace("_reverb", "")).slice(0, -4)
        const fileDest = `./tracks/transform/${filename}_reverb`
        const mp3File = await this.fx.reverb(reverb, damping, room, stereo, preDelay, wetGain, reverse, filepath, fileDest)
        if (dl) {
            return this.fx.downloadEffect("reverb", mp3File)
        } else {
            return this.play(mp3File, this.time())
        }
    }

    public combFilter = async (filepath: string, delay?: number, decay?: number) => {
        if (!delay) delay = 80
        if (!decay) decay = 0.5
        const filename = path.basename(filepath.replace("_comb", "")).slice(0, -4)
        const wavDest = `./tracks/transform/${filename}_comb.wav`
        const mp3File = await this.fx.combFilter(delay, decay, filepath, wavDest) as string
        return this.play(mp3File, this.time())
    }

    public allPass = async (freq: number, width: number, filepath: string, dl?: boolean) => {
        const filename = path.basename(filepath.replace("_allpass", "")).slice(0, -4)
        const fileDest = `./tracks/transform/${filename}_allpass`
        const mp3File = await this.fx.allPass(freq, width, filepath, fileDest)
        if (dl) {
            return this.fx.downloadEffect("allpass", mp3File)
        } else {
            return this.play(mp3File, this.time())
        }
    }

    public time = () => {
        const dispatcher = this.message.guild?.voice?.connection?.dispatcher
        const time = Math.floor(Number(dispatcher?.totalStreamTime) / 1000)
        if (Number.isNaN(time)) return 0
        return time
    }

    public getQueue = () => {
        if (queues.has(this.message.guild?.id)) {
            return queues.get(this.message.guild?.id)
        } else {
            queues.set(this.message.guild?.id, [])
            return []
        }
    }

    public queueAdd = async (link: string, file: string, setReverse?: boolean) => {
        const discord = this.discord
        let kind: "youtube" | "soundcloud" | "link"
        const queueObj = {
            title: "None",
            artist: "None",
            url: "None",
            image: "",
            duration: "None",
            requester: "None",
            details: "None",
            file: "None",
            originalFile: "None",
            playing: false,
            looping: false,
            ablooping: false,
            speed: "1.0",
            pitch: "0",
            filters: [],
            fx: [],
            reverse: setReverse ? true : false
        }
        if (link?.match(/youtube.com|youtu.be/)) {
            const info = await this.youtube.videos.get(link)
            const image = info.snippet.thumbnails.maxres?.url ?? info.snippet.thumbnails.high.url
            const title = info.snippet.title
            const channel = info.snippet.channelTitle
            const duration = this.parseYTDuration(info.contentDetails.duration)
            const url = `https://www.youtube.com/watch?v=${info.id}`
            kind = "youtube"
            queueObj.title = title
            queueObj.artist = channel
            queueObj.url = url
            queueObj.image = image
            queueObj.duration = duration
            queueObj.requester = this.message.author.tag
        } else if (link?.match(/soundcloud.com/)) {
            const info = await this.soundcloud.tracks.get(link) as SoundCloudTrack
            const image = info.artwork_url
            const title = info.title
            const artist = info.user.username
            const duration = this.parseSCDuration(info.duration)
            const url = info.permalink_url
            kind = "soundcloud"
            queueObj.title = title
            queueObj.artist = artist
            queueObj.url = url
            queueObj.image = image
            queueObj.duration = String(duration)
            queueObj.requester = this.message.author.tag
        } else {
            kind = "link"
            queueObj.title = link
            queueObj.url = link
        }
        queueObj.file = file
        queueObj.originalFile = file
        if (kind === "link") {
            queueObj.details =
            `${discord.getEmoji("star")}_Link:_ ${link}\n` +
            `${discord.getEmoji("star")}_Loop Mode:_ **${queueObj.looping ? "Infinite" : (queueObj.ablooping ? "Point A-B" : "One Shot")}**\n` +
            `${discord.getEmoji("star")}_Reverse Mode:_ **${queueObj.reverse ? "On" : "Off"}**\n` +
            `${discord.getEmoji("star")}_Playback Speed:_ **${queueObj.speed}x**\n` +
            `${discord.getEmoji("star")}_Frequency Shift:_ **${queueObj.pitch} semitones**\n` +
            `${discord.getEmoji("star")}_Filters:_ _${queueObj.filters[0] ? "None" : queueObj.filters.join(", ")}_\n` +
            `${discord.getEmoji("star")}_Effects:_ _${queueObj.fx[0] ? "None" : queueObj.fx.join(", ")}_\n` +
            `_Current song position:_ \`${this.parseSCDuration(Number(this.time()*1000))}\`\n` +
            `_Click on any reaction to refresh._\n` +
            `_Added by ${this.message.author.tag}_`
        } else {
            queueObj.details =
            `${discord.getEmoji("star")}_Title:_ [**${queueObj.title}**](${queueObj.url})\n` +
            `${discord.getEmoji("star")}_Artist:_ **${queueObj.artist}**\n` +
            `${discord.getEmoji("star")}_Duration:_ \`${queueObj.duration}\`\n` +
            `${discord.getEmoji("star")}_Loop Mode:_ **${queueObj.looping ? "Infinite" : (queueObj.ablooping ? "Point A-B" : "One Shot")}**\n` +
            `${discord.getEmoji("star")}_Reverse Mode:_ **${queueObj.reverse ? "On" : "Off"}**\n` +
            `${discord.getEmoji("star")}_Playback Speed:_ **${queueObj.speed}x**\n` +
            `${discord.getEmoji("star")}_Frequency Shift:_ **${queueObj.pitch} semitones**\n` +
            `${discord.getEmoji("star")}_Filters:_ _${queueObj.filters[0] ? "None" : queueObj.filters.join(", ")}_\n` +
            `${discord.getEmoji("star")}_Effects:_ _${queueObj.fx[0] ? "None" : queueObj.fx.join(", ")}_\n` +
            `_Current song position:_ \`${this.parseSCDuration(Number(this.time()*1000))}\`\n` +
            `_Click on any reaction to refresh._\n` +
            `_Added by ${this.message.author.tag}_`
        }
        console.log(queueObj)
        const queue = this.getQueue() as any
        const pos = queue.push(queueObj)
        const topImg = kind === "youtube" ? "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png" :
        (kind === "soundcloud" ? "https://i1.sndcdn.com/avatars-000681921569-32qkcn-t500x500.jpg" : "https://clipartmag.com/images/musical-notes-png-11.png")
        const queueEmbed = this.embeds.createEmbed()
        queueEmbed
        .setAuthor(`${kind}`, topImg)
        .setTitle(`**Song Request** ${discord.getEmoji("aquaUp")}`)
        .setURL(queueObj.url)
        .setThumbnail(queueObj?.image ?? "")
        .setDescription(`Added a new song to position **${pos}** in the queue!\n${queueObj.details}`)
        return queueEmbed
    }

    public next = () => {
        const queue = this.getQueue() as any
        const file = queue[0]?.file
        if (!file) return null
        return file
    }

    public loop = () => {
        const queue = this.getQueue() as any
        const looping = queue[0]?.looping
        console.log(queue[0].looping)
        if (looping) {
            queue[0].looping = false
        } else {
            queue[0].looping = true
        }
    }

    public pause = () => {
        const connection = this.message.guild?.voice?.connection
        if (!connection) return
        const player = connection.dispatcher
        player.pause(true)
        return true
    }

    public resume = () => {
        const connection = this.message.guild?.voice?.connection
        if (!connection) return
        const player = connection.dispatcher
        player.resume()
        return true
    }

    public volume = (num: number) => {
        if (num < 0 || num > 200) return this.message.reply("The volume must be between 0 and 200.")
        const connection = this.message.guild?.voice?.connection
        if (!connection) return
        const player = connection.dispatcher
        player.setVolumeLogarithmic(num/100.0)
        return true
    }

    public nowPlaying = async () => {
        const discord = this.discord
        const queue = this.getQueue() as any
        if (!queue) return "It looks like you aren't playing anything..."
        const now = queue[0]
        const nowEmbed = this.updateNowPlaying()
        const msg = await this.message.channel.send(nowEmbed)
        const reactions = ["resume", "pause", "scrub", "reverse", "speed", "pitch", "loop", "abloop", "skip", "volume", "eq", "fx", "clear", "mp3"]
        for (let i = 0; i < reactions.length; i++) await msg.react(discord.getEmoji(reactions[i]))
        const resumeCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("resume") && user.bot === false
        const pauseCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("pause") && user.bot === false
        const scrubCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("scrub") && user.bot === false
        const skipCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("skip") && user.bot === false
        const loopCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("loop") && user.bot === false
        const abLoopCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("abloop") && user.bot === false
        const reverseCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("reverse") && user.bot === false
        const speedCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("speed") && user.bot === false
        const pitchCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("pitch") && user.bot === false
        const volumeCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("volume") && user.bot === false
        const eqCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("eq") && user.bot === false
        const fxCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("fx") && user.bot === false
        const clearCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("clear") && user.bot === false
        const mp3Check = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("mp3") && user.bot === false

        const resume = msg.createReactionCollector(resumeCheck)
        const pause = msg.createReactionCollector(pauseCheck)
        const scrub = msg.createReactionCollector(scrubCheck)
        const skip = msg.createReactionCollector(skipCheck)
        const loop = msg.createReactionCollector(loopCheck)
        const abloop = msg.createReactionCollector(abLoopCheck)
        const reverse = msg.createReactionCollector(reverseCheck)
        const speed = msg.createReactionCollector(speedCheck)
        const pitch = msg.createReactionCollector(pitchCheck)
        const volume = msg.createReactionCollector(volumeCheck)
        const eq = msg.createReactionCollector(eqCheck)
        const fx = msg.createReactionCollector(fxCheck)
        const clear = msg.createReactionCollector(clearCheck)
        const mp3 = msg.createReactionCollector(mp3Check)
        const reactors = [resume, pause, scrub, reverse, speed, pitch, loop, abloop, skip, volume, eq, fx, clear, mp3]
        for (let i = 0; i < reactors.length; i++) {
            reactors[i].on("collect", async (reaction, user) => {
                await msg.edit(this.updateNowPlaying())
                if (reaction.emoji.name === "reverse") {
                    await reaction.users.remove(user)
                    const rep = await this.message.channel.send(`<@${user.id}>, _Please wait, reversing the file..._`)
                    await this.reverse(now.file)
                    if (rep) await rep.delete()
                    await msg.edit(this.updateNowPlaying())
                    return
                } else if (reaction.emoji.name === "volume") {
                    let vol = 100
                    await reaction.users.remove(user)
                    async function getVolumeChange(response: Message) {
                        if (Number.isNaN(parseInt(response.content, 10)) || parseInt(response.content, 10) < 0 || parseInt(response.content, 10) > 200) {
                            const rep = await response.reply("You must pass a number between 0 and 200.")
                            rep.delete({timeout: 3000})
                        } else {
                            vol = parseInt(response.content, 10)
                        }
                        await response.delete()
                    }
                    const rep = await this.message.channel.send(`<@${user.id}>, Enter a volume scaling factor \`0-200%\`.`)
                    await this.embeds.createPrompt(getVolumeChange)
                    if (rep) await rep.delete()
                    return this.volume(vol)
                } else if (reaction.emoji.name === "speed") {
                    let factor = 1.0
                    let setPitch = false
                    await reaction.users.remove(user)
                    async function getSpeedChange(response: Message) {
                        if (response.content.includes("pitch")) {
                            setPitch = true
                            response.content = response.content.replace("pitch", "")
                        }
                        if (response.content?.trim() && Number.isNaN(Number(response.content))) {
                            const rep = await response.reply("You must pass a valid speed factor, eg. \`1.5\` or \`0.5\`.")
                            rep.delete({timeout: 3000})
                        } else {
                            factor = Number(response.content)
                        }
                        await response.delete()
                    }
                    const rep = await this.message.channel.send(`<@${user.id}>, Enter the new speed. Add \`pitch\` to also change the pitch along with the speed.`)
                    await this.embeds.createPrompt(getSpeedChange)
                    if (rep) rep.delete()
                    const rep2 = await this.message.channel.send(`<@${user.id}>, _Please wait, changing the speed of the file..._`)
                    await this.speed(now.file, factor, setPitch)
                    if (rep2) await rep2.delete()
                    return
                } else if (reaction.emoji.name === "loop") {
                    await reaction.users.remove(user)
                    const queue = this.getQueue() as any
                    const loopText = queue[0]?.looping === true ? "Disabled looping!" : "Enabled looping!"
                    const rep = await this.message.channel.send(`<@${user.id}>, ${loopText}`)
                    this.loop()
                    if (rep) await rep.delete({timeout: 3000})
                    await msg.edit(this.updateNowPlaying())
                    return
                } else if (reaction.emoji.name === "skip") {
                    await reaction.users.remove(user)
                    await this.skip()
                    const rep = await this.message.channel.send(`<@${user.id}>, Skipped this track!`)
                    if (rep) await rep.delete({timeout: 3000})
                    return
                } else if (reaction.emoji.name === "pitch") {
                    let semitones = 0
                    await reaction.users.remove(user)
                    async function getPitchChange(response: Message) {
                        if (response.content?.trim() && Number.isNaN(Number(response.content))) {
                            const rep = await response.reply("You must pass in the amount of semitones, eg. \`12\` or \`-12\`.")
                            rep.delete({timeout: 3000})
                        } else {
                            semitones = Number(response.content)
                        }
                        await response.delete()
                    }
                    const rep = await this.message.channel.send(`<@${user.id}>, Enter the new pitch in semitones. 12 semitones = 1 octave.`)
                    await this.embeds.createPrompt(getPitchChange)
                    if (rep) await rep.delete()
                    const rep2 = await this.message.channel.send(`<@${user.id}>, _Please wait, changing the pitch of the file..._`)
                    await this.pitch(now.file, semitones)
                    if (rep2) await rep2.delete()
                    return
                } else if (reaction.emoji.name === "scrub") {
                    let position = "0"
                    await reaction.users.remove(user)
                    async function getPositionChange(response: Message) {
                        position = response.content
                        await response.delete()
                    }
                    const rep = await this.message.channel.send(`<@${user.id}>, Enter the new song position, eg. \`1:00\`.`)
                    await this.embeds.createPrompt(getPositionChange)
                    if (rep) await rep.delete()
                    await this.scrub(position)
                    return
                } else if (reaction.emoji.name === "abloop") {
                    await reaction.users.remove(user)
                    let start = "0"
                    let end = now.duration
                    async function getABLoop(response: Message) {
                        const repArgs = response.content.split(" ")
                        start = repArgs[0]
                        end = repArgs[1]
                        await response.delete()
                    }
                    const rep = await this.message.channel.send(`<@${user.id}>, Enter the starting time and the ending time for the A-B loop. eg \`1:00 1:30\`.`)
                    await this.embeds.createPrompt(getABLoop)
                    if (rep) await rep.delete()
                    await this.abloop(start, end)
                    const abText = queue[0].ablooping === true ? "Disabled A-B looping!" : "Enabled A-B looping!"
                    const rep2 = await this.message.channel.send(`<@${user.id}>, ${abText}`)
                    if (rep2) await rep.delete({timeout: 3000})
                    return
                } else if (reaction.emoji.name === "clear") {
                    await reaction.users.remove(user)
                    await this.clear()
                    const rep = await this.message.channel.send(`<@${user.id}>, Cleared all effects athat were applied to this song!`)
                    if (rep) await rep.delete({timeout: 3000})
                    return
                } else if (reaction.emoji.name === "mp3") {
                    await reaction.users.remove(user)
                    await this.mp3Download(user.id)
                    return
                }
                await reaction.users.remove(user)
                return this[reactions[i]]()
            })
        }
    }

    public updateNowPlaying = () => {
        const discord = this.discord
        const queue = this.getQueue() as any
        const now = queue[0]
        let details = ""
        if (now.kind === "link") {
            details =
            `${discord.getEmoji("star")}_Link:_ ${now.link}\n` +
            `${discord.getEmoji("star")}_Loop Mode:_ **${now.looping ? "Infinite" : (now.ablooping ? "Point A-B" : "One Shot")}**\n` +
            `${discord.getEmoji("star")}_Reverse Mode:_ **${now.reverse ? "On" : "Off"}**\n` +
            `${discord.getEmoji("star")}_Playback Speed:_ **${now.speed}x**\n` +
            `${discord.getEmoji("star")}_Frequency Shift:_ **${now.pitch} semitones**\n` +
            `${discord.getEmoji("star")}_Filters:_ _${now.filters[0] ? "None" : now.filters.join(", ")}_\n` +
            `${discord.getEmoji("star")}_Effects:_ _${now.fx[0] ? "None" : now.fx.join(", ")}_\n` +
            `_Current song position:_ \`${this.parseSCDuration(Number(this.time()*1000))}\`\n` +
            `_Click on any reaction to refresh._\n` +
            `_Added by ${this.message.author.tag}_`
        } else {
            details =
            `${discord.getEmoji("star")}_Title:_ [**${now.title}**](${now.url})\n` +
            `${discord.getEmoji("star")}_Artist:_ **${now.artist}**\n` +
            `${discord.getEmoji("star")}_Duration:_ \`${now.duration}\`\n` +
            `${discord.getEmoji("star")}_Loop Mode:_ **${now.looping ? "Infinite" : (now.ablooping ? "Point A-B" : "One Shot")}**\n` +
            `${discord.getEmoji("star")}_Reverse Mode:_ **${now.reverse ? "On" : "Off"}**\n` +
            `${discord.getEmoji("star")}_Playback Speed:_ **${now.speed}x**\n` +
            `${discord.getEmoji("star")}_Frequency Shift:_ **${now.pitch} semitones**\n` +
            `${discord.getEmoji("star")}_Filters:_ _${now.filters[0] ? "None" : now.filters.join(", ")}_\n` +
            `${discord.getEmoji("star")}_Effects:_ _${now.fx[0] ? "None" : now.fx.join(", ")}_\n` +
            `_Current song position:_ \`${this.parseSCDuration(Number(this.time()*1000))}\`\n` +
            `_Click on any reaction to refresh._\n` +
            `_Added by ${this.message.author.tag}_`
        }
        const nowEmbed = this.embeds.createEmbed()
        nowEmbed
        .setAuthor("playing", "https://clipartmag.com/images/musical-notes-png-11.png")
        .setTitle(`**Now Playing** ${this.discord.getEmoji("chinoSmug")}`)
        .setURL(now.url)
        .setThumbnail(now.image ?? "")
        .setDescription(details)
        return nowEmbed
    }

    public download = async (song: string) => {
        let file = ""
        if (song?.match(/youtube.com|youtu.be/)) {
            file = await this.youtube.util.downloadMP3(song, "./tracks")
        } else if (song?.match(/soundcloud.com/)) {
            file = await this.soundcloud.util.downloadTrack(song, "./tracks")
        } else {
            let name = song.split("#").shift()?.split("?").shift()?.split("/").pop()
            name = name?.match(/.(mp3|wav|ogg|webm)/) ? name : name + ".mp3"
            if (name === ".mp3") name = "noname.mp3"
            const data = await axios.get(song, {responseType: "arraybuffer", headers: this.headers}).then((r) => r.data)
            const dest = `./tracks/${name}`
            fs.writeFileSync(dest, Buffer.from(data, "binary"))
            file = dest
        }
        return file
    }

    public play = async (file: string, start?: number) => {
        const connection = this.message.guild?.voice?.connection
        if (!connection) return
        let player = connection.dispatcher
        if (start) {
            player = connection?.play(file, {seek: start, highWaterMark: 1})
        } else {
            player = connection?.play(file, {highWaterMark: 1})
        }
        player.setBitrate(128)
        player.setFEC(false)
        player.setPLP(1)
        if (player.paused) player.resume()
        const queue = this.getQueue() as any
        if (!queue[0]) await this.queueAdd(file, file)
        queue[0].playing = true

        player.on("finish", async () => {
            const queue = this.getQueue() as any
            console.log("finish")
            console.log(queue)
            let next: string
            if (queue[0]?.looping === true) {
                next = file
            } else {
                queue.shift()
                next = this.next()
            }
            if (next) {
                await this.play(next)
                const nowPlaying = await this.nowPlaying()
                if (nowPlaying) await this.message.channel.send(nowPlaying)
            } else {
                const defSong = defaults.songs[Math.floor(Math.random()*defaults.songs.length)]
                const file = await this.download(defSong)
                await this.queueAdd(defSong, file)
                await this.play(file)
                const nowPlaying = await this.nowPlaying()
                if (nowPlaying) await this.message.channel.send(nowPlaying)
            }
        })
    }

    public skip = async (num?: number) => {
        let amount = num ? num : 1
        let queue = this.getQueue() as any
        if (amount > queue.length - 1) amount = queue.length - 1
        for (let i = 0; i < amount; i++) {
            queue.shift(num)
        }
        queue = this.getQueue() as any
        const setReverse = queue?.[0]?.reverse ? true : false
        if (this.next()) {
            if (setReverse) {
                this.reverse(this.next())
            } else {
                this.play(this.next())
            }
            const nowPlaying = await this.nowPlaying()
            if (nowPlaying) await this.message.channel.send(nowPlaying)
        } else {
            const defSong = defaults.songs[Math.floor(Math.random()*defaults.songs.length)]
            const file = await this.download(defSong)
            await this.queueAdd(defSong, file, setReverse)
            if (setReverse) {
                this.reverse(this.next())
            } else {
                this.play(this.next())
            }
            const nowPlaying = await this.nowPlaying()
            if (nowPlaying) await this.message.channel.send(nowPlaying)
        }
    }

    public scrub = (position: string) => {
        const connection = this.message.guild?.voice?.connection
        if (!connection) return
        const seconds = this.parseSeconds(position)
        if (Number.isNaN(seconds)) return this.message.reply("Try again, provide the time in \`00:00\` format...")
        const queue = this.getQueue() as any
        return this.play(queue[0].file, seconds)
    }

    public abloop = async (start: string, end: string) => {
        const startSec = this.parseSeconds(start)
        const endSec = this.parseSeconds(end)
        if (Number.isNaN(startSec) || Number.isNaN(endSec)) return this.message.reply("Try again, provide the time in \`00:00\` format...")
        const diff = endSec - startSec
        const queue = this.getQueue() as any
        if (queue[0].ablooping === false) {
            queue[0].ablooping = true
        } else {
            queue[0].ablooping = false
        }
        while (queue[0].ablooping) {
            this.play(queue[0].file, startSec)
            await Functions.timeout(diff * 1000)
        }
    }

    public clear = () => {
        const queue = this.getQueue() as any
        return this.play(queue[0].originalFile, this.time())
    }

    public mp3Download = async (userID: string) => {
        const queue = this.getQueue() as any
        const file = queue[0].file
        const attachment = new MessageAttachment(file, `${path.basename(file)}`)
        await this.message.channel.send(`<@${userID}>, Here is the download for this file!`)
        await this.message.channel.send(attachment)
        return
    }

    public parseSeconds = (input: string) => {
        let seconds = 0
        if (input.match(/:/g)?.length === 2) {
            const arr = input.split(":")
            seconds += Number(arr[0]) * 60 * 60
            seconds += Number(arr[1]) * 60
            seconds += Number(arr[2])
        } else if (input.match(/:/g)?.length === 1) {
            const arr = input.split(":")
            seconds += Number(arr[0]) * 60
            seconds += Number(arr[1])
        } else {
            seconds = Number(input)
        }
        return seconds
    }

    public songPickerYT = async (query: string, first?: boolean) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const results = await this.youtube.videos.search({q: query, maxResults: 15}).then((r) => r.items)
        const links = results.map((r) => `https://www.youtube.com/watch?v=${r.id.videoId}`)
        if (first) return links[0]
        const titles = results.map((r) => r.snippet.title)
        const images = results.map((r) => r.snippet.thumbnails.high.url)
        const songArray: MessageEmbed[] = []
        for (let i = 0; i < links.length; i+=3) {
            let description = ""
            for (let j = 0; j < 3; j++) {
                if (!titles[i+j]) break
                description += `${discord.getEmoji(`${j+1}n`)} => [**${titles[i+j]}**](${links[i+j]})\n`
            }
            const songEmbed = embeds.createEmbed()
            songEmbed
            .setAuthor("youtube", "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png", "https://www.youtube.com/")
            .setTitle(`**Youtube Search** ${discord.getEmoji("vigneXD")}`)
            .setThumbnail(images[i])
            .setDescription(description)
            .setFooter(`Page ${Math.floor(i/3) + 1}/${Math.ceil(links.length / 3)}`, message.author.displayAvatarURL({format: "png", dynamic: true}))
            songArray.push(songEmbed)
        }
        return this.playReactionEmbed(songArray, links, "youtube", query)
    }

    public songPickerSC = async (query: string, first?: boolean) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const results = await this.soundcloud.tracks.search({q: query})
        const links = results.map((r) => r.permalink_url)
        if (first) return links[0]
        const titles = results.map((r) => r.title)
        const images = results.map((r) => r.artwork_url)
        const songArray: MessageEmbed[] = []
        for (let i = 0; i < links.length; i+=3) {
            let description = ""
            for (let j = 0; j < 3; j++) {
                if (!titles[i+j]) break
                description += `${discord.getEmoji(`${j+1}n`)} => [**${titles[i+j]}**](${links[i+j]})\n`
            }
            const songEmbed = embeds.createEmbed()
            songEmbed
            .setAuthor("soundcloud", "https://i1.sndcdn.com/avatars-000681921569-32qkcn-t500x500.jpg", "https://www.soundcloud.com/")
            .setTitle(`**Soundcloud Search** ${discord.getEmoji("vigneXD")}`)
            .setThumbnail(images[i])
            .setDescription(description)
            .setFooter(`Page ${Math.floor(i/3) + 1}/${Math.ceil(links.length / 3)}`, message.author.displayAvatarURL({format: "png", dynamic: true}))
            songArray.push(songEmbed)
        }
        return this.playReactionEmbed(songArray, links, "soundcloud", query)
    }

    public playReactionEmbed = async (songArray: MessageEmbed[], links: string[], kind: string, query: string) => {
        const message = this.message
        const discord = this.discord
        if (!songArray[0]) return null
        const msg = await message.channel.send(songArray[0])
        const reactions = ["right", "left", "1n", "2n", "3n", "random"]
        await msg.react(discord.getEmoji(reactions[0]))
        await msg.react(discord.getEmoji(reactions[1]))
        await msg.react(discord.getEmoji(reactions[2]))
        if (links[1]) await msg.react(discord.getEmoji(reactions[3]))
        if (links[2]) await msg.react(discord.getEmoji(reactions[4]))
        await msg.react(discord.getEmoji(reactions[5]))
        if (kind === "soundcloud") await msg.react(discord.getEmoji("youtube"))
        if (kind === "youtube") await msg.react(discord.getEmoji("soundcloud"))
        const rightCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("right") && user.bot === false
        const leftCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("left") && user.bot === false
        const oneCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("1n") && user.bot === false
        const twoCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("2n") && user.bot === false
        const threeCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("3n") && user.bot === false
        const randomCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("random") && user.bot === false
        const soundcloudCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("soundcloud") && user.bot === false
        const youtubeCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("youtube") && user.bot === false

        const right = msg.createReactionCollector(rightCheck)
        const left = msg.createReactionCollector(leftCheck)
        const one = msg.createReactionCollector(oneCheck)
        const two = msg.createReactionCollector(twoCheck)
        const three = msg.createReactionCollector(threeCheck)
        const random = msg.createReactionCollector(randomCheck)
        const soundcloud = msg.createReactionCollector(soundcloudCheck)
        const youtube = msg.createReactionCollector(youtubeCheck)
        const numCollectors = [one, two, three]

        let page = 0
        left.on("collect", async (reaction: MessageReaction, user: User) => {
            if (page === 0) {
                page = songArray.length - 1
            } else {
                page--
            }
            msg.edit(songArray[page])
            await reaction.users.remove(user)
        })
        right.on("collect", async (reaction: MessageReaction, user: User) => {
            if (page === songArray.length - 1) {
                page = 0
            } else {
                page++
            }
            msg.edit(songArray[page])
            await reaction.users.remove(user)
        })
        soundcloud.on("collect", async (reaction, user) => {
            soundcloud.stop()
            await reaction.users.remove(user)
            await this.songPickerSC(query)
        })
        youtube.on("collect", async (reaction, user) => {
            youtube.stop()
            await reaction.users.remove(user)
            await this.songPickerYT(query)
        })
        let finalLink = ""
        await new Promise((resolve) => {
            for (let i = 0; i < numCollectors.length; i++) {
                numCollectors[i].on("collect", async (reaction: MessageReaction, user: User) => {
                    const link = links[numMap[i+1][page]]
                    numCollectors.forEach((c) => c.stop())
                    await reaction.users.remove(user)
                    finalLink = link
                    resolve()
                })
            }
            random.on("collect", async (reaction: MessageReaction, user: User) => {
                const rand = Math.floor(Math.random()*links.length)
                random.stop()
                await reaction.users.remove(user)
                finalLink = links[rand]
                resolve()
            })
        })
        return finalLink
    }

    public parseYTDuration = (duration: string) => {
        const matches = duration.match(/[0-9]+[HMS]/g)
        if (!matches) return "0:00"
        let hours = "0"
        let minutes = "00"
        let seconds = "00"
        matches.forEach(function(part) {
            const unit = part.charAt(part.length-1)
            const amount = String(parseInt(part.slice(0, -1), 10))
            switch (unit) {
                case "H":
                    hours = amount
                    break
                case "M":
                    minutes = amount
                    break
                case "S":
                    seconds = Number(amount) < 10 ? `0${amount}` : amount
                    break
                default:
            }
        })

        const text = `${hours === "0" ? "" : `${hours}:`}${minutes}:${seconds}`
        return text
    }

    public parseSCDuration(duration: number) {
        duration = Number(duration)
        let seconds = Math.floor((duration / 1000) % 60) as any
        let minutes = Math.floor((duration / (1000 * 60)) % 60) as any
        let hours = Math.floor((duration / (1000 * 60 * 60)) % 24) as any

        hours = (hours === 0) ? "" : ((hours < 10) ? "0" + hours + ":" : hours + ":")
        minutes = (minutes < 10) ? "0" + minutes : minutes
        seconds = (seconds < 10) ? "0" + seconds : seconds
        return `${hours}${minutes}:${seconds}`
    }
}
