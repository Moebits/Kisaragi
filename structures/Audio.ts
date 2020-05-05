import axios from "axios"
import {Collection, Message, MessageAttachment, MessageEmbed, MessageReaction, StreamDispatcher, TextChannel, User, VoiceConnection} from "discord.js"
import fs from "fs"
import mp3Duration from "mp3-duration"
import path from "path"
import Soundcloud, {SoundCloudTrack} from "soundcloud.ts"
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
const musicSettings = new Collection()
const procBlock = new Collection()

export class Audio {
    private readonly headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}
    private readonly fx = new AudioEffects(this.discord, this.message)
    private readonly video = new Video(this.discord, this.message)
    private readonly youtube = new Youtube(process.env.GOOGLE_API_KEY!)
    private readonly soundcloud = new Soundcloud(process.env.SOUNDCLOUD_CLIENT_ID)
    private readonly embeds = new Embeds(this.discord, this.message)
    constructor(private readonly discord: Kisaragi, private readonly message: Message) {}

    public checkMusicPermissions = () => {
        const message = this.message
        if (!(message.channel as TextChannel).permissionsFor(message.guild?.me!)?.has(["MANAGE_MESSAGES", "CONNECT", "SPEAK"])) {
            message.channel.send(`The bot needs the permissions **Manage Messages**, **Connect**, and **Speak** for all music commands. ${this.discord.getEmoji("kannaFacepalm")}`)
            return false
        } else {
            return true
        }
    }

    public checkMusicPlaying = () => {
        const connection = this.message.guild?.voice?.connection
        const queue = this.getQueue() as any
        if (!connection || !queue?.[0]) {
            this.message.channel.send(`<@${this.message.author.id}>, You must be playing music in order to use this command ${this.discord.getEmoji("kannaFacepalm")}`)
            return false
        } else {
            return true
        }
    }

    public compression = async (filepath: string, amount?: number, dl?: boolean) => {
        if (!amount) amount = 80
        if (amount < 0) amount = 0
        if (amount > 100) amount = 100
        const queue = this.getQueue() as any
        const settings = this.getSettings() as any
        settings.effectParams.compression = [amount]
        const filename = path.basename(filepath.replace("_compress", "")).slice(0, -4)
        const fileDest = `./tracks/transform/${filename}_compress`
        let mp3File: string
        try {
            mp3File = await this.fx.compress(amount, filepath, fileDest)
        } catch {
            mp3File = `${fileDest}.mp3`
        }
        if (queue[0]) queue[0].file = mp3File
        if (dl) {
            return this.fx.downloadEffect("compress", mp3File)
        } else {
            return this.play(mp3File, this.time())
        }
    }

    public tremolo = async (filepath: string, speed?: number, depth?: number, dl?: boolean) => {
        if (!speed) speed = 10
        if (!depth) depth = 70
        if (depth < 0) depth = 0
        if (depth > 100) depth = 100
        const queue = this.getQueue() as any
        const settings = this.getSettings() as any
        settings.effectParams.tremolo = [speed, depth]
        const filename = path.basename(filepath.replace("_tremolo", "")).slice(0, -4)
        const fileDest = `./tracks/transform/${filename}_tremolo`
        let mp3File: string
        try {
            mp3File = await this.fx.tremolo(speed, depth, filepath, fileDest)
        } catch {
            mp3File = `${fileDest}.mp3`
        }
        if (queue[0]) queue[0].file = mp3File
        if (dl) {
            return this.fx.downloadEffect("tremolo", mp3File)
        } else {
            return this.play(mp3File, this.time())
        }
    }

    public lowpass = async (filepath: string, freq?: number, width?: number, dl?: boolean) => {
        if (!freq) freq = 1500
        if (!width) width = 100
        const queue = this.getQueue() as any
        const settings = this.getSettings() as any
        settings.filterParams.lowpass = [freq, width]
        const filename = path.basename(filepath.replace("_lowpass", "")).slice(0, -4)
        const fileDest = `./tracks/transform/${filename}_lowpass`
        let mp3File: string
        try {
            mp3File = await this.fx.lowpass(freq, width, filepath, fileDest)
        } catch {
            mp3File = `${fileDest}.mp3`
        }
        if (queue[0]) queue[0].file = mp3File
        if (dl) {
            return this.fx.downloadEffect("lowpass", mp3File)
        } else {
            return this.play(mp3File, this.time())
        }
    }

    public highpass = async (filepath: string, freq?: number, width?: number, dl?: boolean) => {
        if (!freq) freq = 600
        if (!width) width = 100
        const queue = this.getQueue() as any
        const settings = this.getSettings() as any
        settings.filterParams.highpass = [freq, width]
        const filename = path.basename(filepath.replace("_highpass", "")).slice(0, -4)
        const fileDest = `./tracks/transform/${filename}_highpass`
        let mp3File: string
        try {
            mp3File = await this.fx.highpass(freq, width, filepath, fileDest)
        } catch {
            mp3File = `${fileDest}.mp3`
        }
        if (queue[0]) queue[0].file = mp3File
        if (dl) {
            return this.fx.downloadEffect("highpass", mp3File)
        } else {
            return this.play(mp3File, this.time())
        }
    }

    public peak = async (filepath: string, freq?: number, resonance?: number, gain?: number, dl?: boolean) => {
        if (!freq) freq = 1000
        if (!resonance) resonance = 2
        if (!gain) gain = -3
        const queue = this.getQueue() as any
        const settings = this.getSettings() as any
        settings.filterParams.peak = [freq, resonance, gain]
        const filename = path.basename(filepath.replace("_peak", "")).slice(0, -4)
        const fileDest = `./tracks/transform/${filename}_peak`
        let mp3File: string
        try {
            mp3File = await this.fx.peak(freq, resonance, gain, filepath, fileDest)
        } catch {
            mp3File = `${fileDest}.mp3`
        }
        if (queue[0]) queue[0].file = mp3File
        if (dl) {
            return this.fx.downloadEffect("peak", mp3File)
        } else {
            return this.play(mp3File, this.time())
        }
    }

    public lowshelf = async (filepath: string, gain?: number, freq?: number, width?: number, dl?: boolean) => {
        if (!gain) gain = 3
        if (!freq) freq = 1000
        if (!width) width = 100
        const queue = this.getQueue() as any
        const settings = this.getSettings() as any
        settings.filterParams.lowshelf = [gain, freq, width]
        const filename = path.basename(filepath.replace("_lowshelf", "")).slice(0, -4)
        const fileDest = `./tracks/transform/${filename}_lowshelf`
        let mp3File: string
        try {
            mp3File = await this.fx.lowshelf(gain, freq, width, filepath, fileDest)
        } catch {
            mp3File = `${fileDest}.mp3`
        }
        if (queue[0]) queue[0].file = mp3File
        if (dl) {
            return this.fx.downloadEffect("lowshelf", mp3File)
        } else {
            return this.play(mp3File, this.time())
        }
    }

    public highshelf = async (filepath: string, gain?: number, freq?: number, width?: number, dl?: boolean) => {
        if (!gain) gain = 3
        if (!freq) freq = 1000
        if (!width) width = 100
        const queue = this.getQueue() as any
        const settings = this.getSettings() as any
        settings.filterParams.highshelf = [gain, freq, width]
        const filename = path.basename(filepath.replace("_highshelf", "")).slice(0, -4)
        const fileDest = `./tracks/transform/${filename}_highshelf`
        let mp3File: string
        try {
            mp3File = await this.fx.highshelf(gain, freq, width, filepath, fileDest)
        } catch {
            mp3File = `${fileDest}.mp3`
        }
        if (queue[0]) queue[0].file = mp3File
        if (dl) {
            return this.fx.downloadEffect("highshelf", mp3File)
        } else {
            return this.play(mp3File, this.time())
        }
    }

    public bandpass = async (filepath: string, freq?: number, width?: number, dl?: boolean) => {
        if (!freq) freq = 700
        if (!width) width = 100
        const queue = this.getQueue() as any
        const settings = this.getSettings() as any
        settings.filterParams.bandpass = [freq, width]
        const filename = path.basename(filepath.replace("_bandpass", "")).slice(0, -4)
        const fileDest = `./tracks/transform/${filename}_bandpass`
        let mp3File: string
        try {
            mp3File = await this.fx.bandpass(freq, width, filepath, fileDest)
        } catch {
            mp3File = `${fileDest}.mp3`
        }
        if (queue[0]) queue[0].file = mp3File
        if (dl) {
            return this.fx.downloadEffect("bandpass", mp3File)
        } else {
            return this.play(mp3File, this.time())
        }
    }

    public bandreject = async (filepath: string, freq?: number, width?: number, dl?: boolean) => {
        if (!freq) freq = 500
        if (!width) width = 100
        const queue = this.getQueue() as any
        const settings = this.getSettings() as any
        settings.filterParams.bandreject = [freq, width]
        const filename = path.basename(filepath.replace("_bandreject", "")).slice(0, -4)
        const fileDest = `./tracks/transform/${filename}_bandreject`
        let mp3File: string
        try {
            mp3File = await this.fx.bandreject(freq, width, filepath, fileDest)
        } catch {
            mp3File = `${fileDest}.mp3`
        }
        if (queue[0]) queue[0].file = mp3File
        if (dl) {
            return this.fx.downloadEffect("bandreject", mp3File)
        } else {
            return this.play(mp3File, this.time())
        }
    }

    public upsample = async (filepath: string, factor?: number, dl?: boolean) => {
        if (!factor) factor = 2
        if (factor > 5) factor = 5
        const queue = this.getQueue() as any
        const settings = this.getSettings() as any
        settings.effectParams.upsample = [factor]
        const filename = path.basename(filepath.replace("_upsample", "")).slice(0, -4)
        const fileDest = `./tracks/transform/${filename}_upsample`
        let mp3File: string
        try {
            mp3File = await this.fx.upsample(factor, filepath, fileDest)
        } catch {
            mp3File = `${fileDest}.mp3`
        }
        if (queue[0]) queue[0].file = mp3File
        if (dl) {
            return this.fx.downloadEffect("upsample", mp3File)
        } else {
            return this.play(mp3File, this.time())
        }
    }

    public bitcrush = async (filepath: string, factor?: number, dl?: boolean) => {
        if (!factor) factor = 2
        if (factor > 5) factor = 5
        const queue = this.getQueue() as any
        const settings = this.getSettings() as any
        settings.effectParams.bitcrush = [factor]
        const filename = path.basename(filepath.replace("_bitcrush", "")).slice(0, -4)
        const fileDest = `./tracks/transform/${filename}_bitcrush`
        let mp3File: string
        try {
            mp3File = await this.fx.bitcrush(factor, filepath, fileDest)
        } catch {
            mp3File = `${fileDest}.mp3`
        }
        if (queue[0]) queue[0].file = mp3File
        if (dl) {
            return this.fx.downloadEffect("bitcrush", mp3File)
        } else {
            return this.play(mp3File, this.time())
        }
    }

    public distortion = async (filepath: string, gain?: number, color?: number, dl?: boolean) => {
        if (!gain) gain = 20
        if (!color) color = 20
        const queue = this.getQueue() as any
        const settings = this.getSettings() as any
        settings.effectParams.distortion = [gain, color]
        const filename = path.basename(filepath.replace("_distortion", "")).slice(0, -4)
        const fileDest = `./tracks/transform/${filename}_distortion`
        let mp3File: string
        try {
            mp3File = await this.fx.distortion(gain, color, filepath, fileDest)
        } catch {
            mp3File = `${fileDest}.mp3`
        }
        if (queue[0]) queue[0].file = mp3File
        if (dl) {
            return this.fx.downloadEffect("distortion", mp3File)
        } else {
            return this.play(mp3File, this.time())
        }
    }

    public chorus = async (filepath: string, delay?: number, decay?: number, speed?: number, depth?: number, dl?: boolean) => {
        if (!delay) delay = 50
        if (!decay) decay = 0.3
        if (!speed) speed = 2
        if (!depth) depth = 2
        if (speed > 5) speed = 5
        const queue = this.getQueue() as any
        const settings = this.getSettings() as any
        settings.effectParams.chorus = [delay, decay, speed, depth]
        const filename = path.basename(filepath.replace("_chorus", "")).slice(0, -4)
        const fileDest = `./tracks/transform/${filename}_chorus`
        let mp3File: string
        try {
            mp3File = await this.fx.chorus(delay, decay, speed, depth, filepath, fileDest)
        } catch {
            mp3File = `${fileDest}.mp3`
        }
        if (queue[0]) queue[0].file = mp3File
        if (dl) {
            return this.fx.downloadEffect("chorus", mp3File)
        } else {
            return this.play(mp3File, this.time())
        }
    }

    public phaser = async (filepath: string, delay?: number, decay?: number, speed?: number, dl?: boolean) => {
        if (!delay) delay = 3
        if (!decay) decay = 0.5
        if (!speed) speed = 0.5
        if (speed > 5) speed = 5
        const queue = this.getQueue() as any
        const settings = this.getSettings() as any
        settings.effectParams.phaser = [delay, decay, speed]
        const filename = path.basename(filepath.replace("_phaser", "")).slice(0, -4)
        const fileDest = `./tracks/transform/${filename}_phaser`
        let mp3File: string
        try {
            mp3File = await this.fx.phaser(delay, decay, speed, filepath, fileDest)
        } catch {
            mp3File = `${fileDest}.mp3`
        }
        if (queue[0]) queue[0].file = mp3File
        if (dl) {
            return this.fx.downloadEffect("phaser", mp3File)
        } else {
            return this.play(mp3File, this.time())
        }
    }

    public flanger = async (filepath: string, delay?: number, depth?: number, regen?: number, width?: number, speed?: number, shape?: "sin" | "tri", phase?: number, interp?: "lin" | "quad", dl?: boolean) => {
        if (!delay) delay = 0
        if (!depth) depth = 2
        if (!regen) regen = 0
        if (!width) width = 71
        if (!speed) speed = 0.5
        if (!shape) shape = "sin"
        if (!phase) phase = 25
        if (!interp) interp = "lin"
        if (delay > 30) delay = 30
        if (depth > 10) depth = 10
        if (regen < -95) regen = -95
        if (regen > 95) regen = 95
        if (width < 0) width = 0
        if (width > 100) width = 100
        if (speed < 0.1) speed = 0.1
        if (speed > 10) speed = 10
        if (shape !== "sin" && shape !== "tri") shape = "sin"
        if (phase < 0) phase = 0
        if (phase > 100) phase = 100
        if (interp !== "lin" && interp !== "quad") interp = "lin"
        const queue = this.getQueue() as any
        const settings = this.getSettings() as any
        settings.effectParams.flanger = [delay, depth, regen, width, speed, shape, phase, interp]
        const filename = path.basename(filepath.replace("_flanger", "")).slice(0, -4)
        const fileDest = `./tracks/transform/${filename}_flanger`
        let mp3File: string
        try {
            mp3File = await this.fx.flanger(delay, depth, regen, width, speed, shape, phase, interp, filepath, fileDest)
        } catch {
            mp3File = `${fileDest}.mp3`
        }
        if (queue[0]) queue[0].file = mp3File
        if (dl) {
            return this.fx.downloadEffect("flanger", mp3File)
        } else {
            return this.play(mp3File, this.time())
        }
    }

    public delay = async (filepath: string, delaysDecays?: number[], dl?: boolean) => {
        if (!delaysDecays) delaysDecays = [60, 0.4]
        const queue = this.getQueue() as any
        const settings = this.getSettings() as any
        settings.effectParams.delay = [delaysDecays]
        const filename = path.basename(filepath.replace("_delay", "")).slice(0, -4)
        const fileDest = `./tracks/transform/${filename}_delay`
        let mp3File: string
        try {
            mp3File = await this.fx.delay(delaysDecays, filepath, fileDest)
        } catch {
            mp3File = `${fileDest}.mp3`
        }
        if (queue[0]) queue[0].file = mp3File
        if (dl) {
            return this.fx.downloadEffect("delay", mp3File)
        } else {
            return this.play(mp3File, this.time())
        }
    }

    public speed = async (filepath: string, factor?: number, pitch?: boolean, dl?: boolean, skipAdd?: boolean) => {
        if (!factor) factor = 1
        if (factor < 0.1) factor = 0.1
        if (factor > 100) factor = 100
        const queue = this.getQueue() as any
        const settings = this.getSettings() as any
        if (!pitch) pitch = false
        const filename = path.basename(filepath.replace("_speed", "")).slice(0, -4)
        const fileDest = `./tracks/transform/${filename}_speed`
        let mp3File: string
        try {
            mp3File = await this.fx.speed(factor, pitch, filepath, fileDest)
        } catch {
            mp3File = `${fileDest}.mp3`
        }
        if (queue[0]) queue[0].file = mp3File
        if (!skipAdd) {
            if (factor < 0) {
                settings.speed /= factor
            } else {
                settings.speed *= factor
            }
            if (pitch) settings.speedParam = pitch
        }
        if (dl) {
            return this.fx.downloadEffect("speed", mp3File)
        } else {
            return this.play(mp3File, this.time())
        }
    }

    public pitch = async (filepath: string, semitones?: number, dl?: boolean, skipAdd?: boolean) => {
        if (!semitones) semitones = 0
        const queue = this.getQueue() as any
        const settings = this.getSettings() as any
        const filename = path.basename(filepath.replace("_pitch", "")).slice(0, -4)
        const fileDest = `./tracks/transform/${filename}_pitch`
        let mp3File: string
        try {
            mp3File = await this.fx.pitch(semitones, filepath, fileDest)
        } catch {
            mp3File = `${fileDest}.mp3`
        }
        if (queue[0]) queue[0].file = mp3File
        if (!skipAdd) settings.pitch += semitones
        if (dl) {
            return this.fx.downloadEffect("pitch", mp3File)
        } else {
            return this.play(mp3File, this.time())
        }
    }

    public reverse = async (filepath: string, dl?: boolean, skipAdd?: boolean) => {
        const queue = this.getQueue() as any
        const settings = this.getSettings() as any
        const filename = path.basename(filepath.replace("_reverse", "")).slice(0, -4)
        const fileDest = `./tracks/transform/${filename}_reverse`
        let mp3File: string
        try {
            mp3File = await this.fx.reverse(filepath, fileDest)
        } catch {
            mp3File = `${fileDest}.mp3`
        }
        if (queue[0]) queue[0].file = mp3File
        if (!skipAdd) settings.reverse = settings.reverse === true ? false : true
        if (dl) {
            return this.fx.downloadEffect("reverse", mp3File)
        } else {
            return this.play(mp3File, this.time())
        }
    }

    public reverb = async (filepath: string, reverb?: number, damping?: number, room?: number, stereo?: number, preDelay?: number, wetGain?: number, reverse?: boolean, dl?: boolean) => {
        if (!reverb) reverb = 50
        if (!damping) damping = 50
        if (!room) room = 100
        if (!stereo) stereo = 100
        if (!preDelay) preDelay = 0
        if (!wetGain) wetGain = 0
        if (!reverse) reverse = false
        if (stereo < 0) stereo = 0
        if (stereo > 100) stereo = 100
        const queue = this.getQueue() as any
        const settings = this.getSettings() as any
        settings.effectParams.reverb = [reverb, damping, room, stereo, preDelay, wetGain]
        const filename = path.basename(filepath.replace("_reverb", "")).slice(0, -4)
        const fileDest = `./tracks/transform/${filename}_reverb`
        let mp3File: string
        try {
            mp3File = await this.fx.reverb(reverb, damping, room, stereo, preDelay, wetGain, reverse, filepath, fileDest)
        } catch {
            mp3File = `${fileDest}.mp3`
        }
        if (queue[0]) queue[0].file = mp3File
        if (dl) {
            return this.fx.downloadEffect("reverb", mp3File)
        } else {
            return this.play(mp3File, this.time())
        }
    }

    public allPass = async (filepath: string, freq?: number, width?: number, dl?: boolean) => {
        if (!freq) freq = 600
        if (!width) width = 100
        const queue = this.getQueue() as any
        const settings = this.getSettings() as any
        settings.effectParams.allpass = [freq, width]
        const filename = path.basename(filepath.replace("_allpass", "")).slice(0, -4)
        const fileDest = `./tracks/transform/${filename}_allpass`
        let mp3File: string
        try {
            mp3File = await this.fx.allPass(freq, width, filepath, fileDest)
        } catch {
            mp3File = `${fileDest}.mp3`
        }
        if (queue[0]) queue[0].file = mp3File
        if (dl) {
            return this.fx.downloadEffect("allpass", mp3File)
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

    public time = () => {
        const dispatcher = this.message.guild?.voice?.connection?.dispatcher
        const time = Math.floor(Number(dispatcher?.streamTime) / 1000.0)
        if (Number.isNaN(time)) return 0
        return time
    }

    public rewind = (input: string) => {
        const seconds = this.parseSeconds(input)
        const time = this.time()
        const queue = this.getQueue() as any
        let rewind = time - seconds
        if (rewind < 0) rewind = 0
        return this.play(queue[0].file, rewind)
    }

    public fastforward = (input: string) => {
        const seconds = this.parseSeconds(input)
        const time = this.time()
        const queue = this.getQueue() as any
        return this.play(queue[0].file, time + seconds)
    }

    public getQueue = () => {
        if (queues.has(this.message.guild?.id)) {
            return queues.get(this.message.guild?.id)
        } else {
            queues.set(this.message.guild?.id, [])
            return []
        }
    }

    public getSettings = () => {
        if (musicSettings.has(this.message.guild?.id)) {
            return musicSettings.get(this.message.guild?.id)
        } else {
            const settings = {
                reverse: false,
                looping: false,
                ablooping: false,
                autoplay: false,
                speed: 1.0,
                pitch: 0,
                filters: [],
                effects: [],
                filterParams: {},
                effectParams: {},
                speedParam: false
            }
            musicSettings.set(this.message.guild?.id, settings)
            return settings
        }
    }

    public getProcBlock = () => {
        if (procBlock.has(this.message.guild?.id)) {
            return true
        } else {
            return false
        }
    }

    public setProcBlock = (remove?: boolean) => {
        if (remove) {
            procBlock.delete(this.message.guild?.id)
        } else {
            procBlock.set(this.message.guild?.id, true)
        }
    }

    public deleteQueue = (pos?: number, end?: number) => {
        if (pos) {
            if (!end) end = 1
            let queue = this.getQueue() as any
            queue = queue.splice(pos-1, end)
            queues.set(this.message.guild?.id, queue)
        } else {
            queues.set(this.message.guild?.id, [])
            musicSettings.delete(this.message.guild?.id)
        }
    }

    public shuffle = () => {
        let queue = this.getQueue() as any
        queue = Functions.shuffleArray(queue)
        queues.set(this.message.guild?.id, queue)
    }

    public queueAdd = async (link: string, file: string) => {
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
            message: null
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
            queueObj.duration = duration as string
        } else if (link?.match(/soundcloud.com/)) {
            const info = await this.soundcloud.tracks.getURL(link) as SoundCloudTrack
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
        } else {
            kind = "link"
            queueObj.title = link
            queueObj.url = link
        }
        queueObj.file = file
        queueObj.originalFile = file
        queueObj.requester = this.message.author.tag
        if (kind === "link") {
            queueObj.details =
            `${discord.getEmoji("star")}_Link:_ ${link}\n` +
            `_Added by ${this.message.author.tag}_`
        } else {
            queueObj.details =
            `${discord.getEmoji("star")}_Title:_ [**${queueObj.title}**](${queueObj.url})\n` +
            `${discord.getEmoji("star")}_Artist:_ **${queueObj.artist}**\n` +
            `${discord.getEmoji("star")}_Duration:_ \`${queueObj.duration}\`\n` +
            `_Added by ${this.message.author.tag}_`
        }
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
        const settings = this.getSettings() as any
        const looping = settings.looping
        if (looping) {
            settings.looping = false
        } else {
            settings.looping = true
        }
    }

    public autoplay = () => {
        const settings = this.getSettings() as any
        const autoplay = settings.autoplay
        if (autoplay) {
            settings.autoplay = false
        } else {
            settings.autoplay = true
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
        const settings = this.getSettings() as any
        if (!queue) return "It looks like you aren't playing anything..."
        const now = queue[0]
        const nowEmbed = await this.updateNowPlaying()
        const msg = await this.message.channel.send(nowEmbed)
        now.message = msg
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
                let test = true
                if (reaction.emoji.name === "reverse") test = false
                if (reaction.emoji.name === "speed") test = false
                if (reaction.emoji.name === "pitch") test = false
                if (reaction.emoji.name === "eq") test = false
                if (reaction.emoji.name === "fx") test = false
                if (this.getProcBlock() && !test) {
                    await reaction.users.remove(user)
                    const proc = await this.message.channel.send(`<@${user.id}>, Please wait until the current effect is done processing before adding another.`)
                    proc.delete({timeout: 3000})
                    return
                }
                this.setProcBlock()
                await msg.edit(await this.updateNowPlaying())
                if (reaction.emoji.name === "reverse") {
                    await reaction.users.remove(user)
                    const rep = await this.message.channel.send(`<@${user.id}>, _Please wait, reversing the file..._`)
                    await this.reverse(now.file)
                    rep.delete()
                    await msg.edit(await this.updateNowPlaying())
                    this.setProcBlock(true)
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
                    rep.delete()
                    await this.volume(vol)
                    this.setProcBlock(true)
                } else if (reaction.emoji.name === "speed") {
                    let factor = 1.0
                    let setPitch = false
                    await reaction.users.remove(user)
                    async function getSpeedChange(response: Message) {
                        response.content = response.content.replace("x", "")
                        if (response.content.includes("pitch")) {
                            setPitch = true
                            response.content = response.content.replace("pitch", "")
                        }
                        if (response.content?.trim() && Number.isNaN(Number(response.content))) {
                            const rep = await response.reply("You must pass a valid speed factor, eg. \`1.5x\` or \`0.5x\`.")
                            rep.delete({timeout: 3000})
                        } else {
                            factor = Number(response.content)
                        }
                        await response.delete()
                    }
                    const rep = await this.message.channel.send(`<@${user.id}>, Enter the new speed, eg \`1.5x\`. Add \`pitch\` to also change the pitch along with the speed.`)
                    await this.embeds.createPrompt(getSpeedChange)
                    rep.delete()
                    const rep2 = await this.message.channel.send(`<@${user.id}>, _Please wait, changing the speed of the file..._`)
                    await this.speed(now.file, factor, setPitch)
                    rep2.delete()
                    await msg.edit(await this.updateNowPlaying())
                    this.setProcBlock(true)
                    return
                } else if (reaction.emoji.name === "loop") {
                    await reaction.users.remove(user)
                    const loopText = settings.looping === true ? "Disabled looping!" : "Enabled looping!"
                    const rep = await this.message.channel.send(`<@${user.id}>, ${loopText}`)
                    this.loop()
                    await msg.edit(await this.updateNowPlaying())
                    rep.delete({timeout: 1000})
                    this.setProcBlock(true)
                    return
                } else if (reaction.emoji.name === "skip") {
                    await reaction.users.remove(user)
                    const rep = await this.message.channel.send(`<@${user.id}>, Skipping this track! **If you added effects, be patient because they need to be re-applied.**`)
                    rep.delete({timeout: 3000})
                    await this.skip()
                    this.setProcBlock(true)
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
                    rep.delete()
                    const rep2 = await this.message.channel.send(`<@${user.id}>, _Please wait, changing the pitch of the file..._`)
                    await this.pitch(now.file, semitones)
                    rep2.delete()
                    await msg.edit(await this.updateNowPlaying())
                    this.setProcBlock(true)
                    return
                } else if (reaction.emoji.name === "scrub") {
                    let position = "0"
                    await reaction.users.remove(user)
                    async function getPositionChange(response: Message) {
                        position = response.content
                        await response.delete()
                    }
                    const rep = await this.message.channel.send(`<@${user.id}>, Enter the new song position, eg. \`1:00\`. You can also fastforward or rewind, eg. \`+10\` and \`-10\`.`)
                    await this.embeds.createPrompt(getPositionChange)
                    rep.delete()
                    await this.scrub(position)
                    await msg.edit(await this.updateNowPlaying())
                    this.setProcBlock(true)
                    return
                } else if (reaction.emoji.name === "abloop") {
                    await reaction.users.remove(user)
                    if (settings.ablooping === true) {
                        settings.ablooping = false
                        await this.play(queue[0].file)
                        await msg.edit(await this.updateNowPlaying())
                        const rep = await this.message.channel.send(`<@${user.id}>, Disabled A-B looping!`)
                        rep.delete({timeout: 3000})
                        return
                    }
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
                    rep.delete()
                    const rep2 = await this.message.channel.send(`<@${user.id}>, Enabled A-B Looping!`)
                    rep2.delete({timeout: 3000})
                    settings.ablooping = true
                    await msg.edit(await this.updateNowPlaying())
                    this.setProcBlock(true)
                    await this.abloop(start, end)
                    return
                } else if (reaction.emoji.name === "clear") {
                    await reaction.users.remove(user)
                    await this.clear()
                    const rep = await this.message.channel.send(`<@${user.id}>, Cleared all effects that were applied to this song!`)
                    rep.delete({timeout: 3000})
                    await msg.edit(await this.updateNowPlaying())
                    this.setProcBlock(true)
                    return
                } else if (reaction.emoji.name === "mp3") {
                    await reaction.users.remove(user)
                    await this.mp3Download(user.id)
                    this.setProcBlock(true)
                    return
                } else if (reaction.emoji.name === "eq") {
                    await reaction.users.remove(user)
                    const m = await this.equalizerMenu(true)
                    await msg.edit(await this.updateNowPlaying())
                    m.delete()
                    return
                } else if (reaction.emoji.name === "fx") {
                    await reaction.users.remove(user)
                    const m = await this.fxMenu(true)
                    await msg.edit(await this.updateNowPlaying())
                    m.delete()
                    return
                }
                await reaction.users.remove(user)
                await this[reactions[i]]()
                this.setProcBlock(true)
            })
        }
    }

    public updateNowPlaying = async (position?: number) => {
        if (!position) position = 0
        const duration = await this.getDuration()
        const durationStr = this.parseSCDuration(duration*1000)
        const discord = this.discord
        const queue = this.getQueue() as any
        const settings = this.getSettings() as any
        const now = queue[position]
        let details = ""
        if (now?.kind === "link") {
            details =
            `${settings.autoplay ? `${discord.getEmoji("autoplay")}Autoplay is **on**! ${discord.getEmoji("tohruSmug")}\n` : ""}` +
            `${settings.looping || settings.ablooping ? `${settings.ablooping ? discord.getEmoji("abloop") : discord.getEmoji("loop")}Loop mode is **on**! ${discord.getEmoji("aquaUp")}\n` : ""}` +
            `${settings.reverse ? `${discord.getEmoji("reverse")}Reverse mode is **on**! ${discord.getEmoji("gabYes")}\n` : ""}` +
            `${discord.getEmoji("star")}_Duration:_ \`${durationStr}\`\n` +
            `${discord.getEmoji("star")}_Link:_ ${now.link.length < 1000 ? now.link : "Link is too long"}\n` +
            `${discord.getEmoji("speed")}_Speed:_ **${settings.speed}x**  ` +
            `${discord.getEmoji("pitch")}_Freq:_ **${Number(settings.pitch) > -1 ? `+${settings.pitch}` : settings.pitch}**\n` +
            `${discord.getEmoji("highpass")}_Filters:_ _${settings.filters[0] ? settings.filters.map((f: string) => Functions.toProperCase(f)).join(", ") : "None"}_  ` +
            `${discord.getEmoji("delay")}_Effects:_ _${settings.effects[0] ? settings.effects.map((e: string) => Functions.toProperCase(e)).join(", ") : "None"}_\n` +
            `${discord.getEmoji("position")}_Song position:_ \`${this.parseSCDuration(Number(this.time()*1000))}\`\n` +
            `_Added by ${now.requester}_`
        } else {
            details =
            `${settings.autoplay ? `${discord.getEmoji("autoplay")}Autoplay is **on**! ${discord.getEmoji("tohruSmug")}\n` : ""}` +
            `${settings.looping || settings.ablooping ? `${settings.ablooping ? discord.getEmoji("abloop") : discord.getEmoji("loop")}Loop mode is **on**! ${discord.getEmoji("aquaUp")}\n` : ""}` +
            `${settings.reverse ? `${discord.getEmoji("reverse")}Reverse mode is **on**! ${discord.getEmoji("gabYes")}\n` : ""}` +
            `${discord.getEmoji("star")}_Title:_ [**${now.title}**](${now.url})\n` +
            `${discord.getEmoji("star")}_Artist:_ **${now.artist}**\n` +
            `${discord.getEmoji("star")}_Duration:_ \`${durationStr}\`\n` +
            `${discord.getEmoji("speed")}_Speed:_ **${settings.speed}x**  ` +
            `${discord.getEmoji("pitch")}_Freq:_ **${Number(settings.pitch) > -1 ? `+${settings.pitch}` : settings.pitch}**\n` +
            `${discord.getEmoji("highpass")}_Filters:_ _${settings.filters[0] ? settings.filters.map((f: string) => Functions.toProperCase(f)).join(", ") : "None"}_  ` +
            `${discord.getEmoji("delay")}_Effects:_ _${settings.effects[0] ? settings.effects.map((e: string) => Functions.toProperCase(e)).join(", ") : "None"}_\n` +
            `${discord.getEmoji("position")}_Song position:_ \`${this.parseSCDuration(Number(this.time()*1000))}\`\n` +
            `_Added by ${now.requester}_`
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

    public getDuration = async () => {
        const queue = this.getQueue() as any
        let duration = 0
        await new Promise((resolve) => {
            mp3Duration(queue[0].file, function(err: Error, d: number) {
                duration = d
                resolve()
            })
        })
        return Math.round(duration)
    }

    public download = async (song: string, query?: string) => {
        let file = ""
        if (song?.match(/youtube.com|youtu.be/)) {
            file = await this.youtube.util.downloadMP3(song, "./tracks")
        } else if (song?.match(/soundcloud.com/)) {
            try {
                file = await this.soundcloud.util.downloadTrack(song, "./tracks")
            } catch {
                await this.message.channel.send("The Soundcloud token has expired, so the bot will search YouTube as fallback. Let the developer know with the \`feedback\` command.")
                const link = await this.songPickerYT(query ?? song, true)
                return link ? this.download(link) : ""
            }
        } else {
            let name = song.split("#").shift()?.split("?").shift()?.split("/").pop()
            name = name?.match(/.(mp3|wav|ogg|webm)/) ? name : name + ".mp3"
            if (name === ".mp3") name = "noname.mp3"
            const data = await axios.get(song, {responseType: "arraybuffer", headers: this.headers}).then((r) => r.data)
            const dest = path.join(__dirname, `../tracks/${name}`)
            fs.writeFileSync(dest, Buffer.from(data, "binary"))
            file = dest
        }
        return file
    }

    public applyEffects = async (newFile: string) => {
        const settings = this.getSettings() as any
        if (settings.reverse) {
            await this.reverse(newFile, false, true)
        }
        if (Number(settings.pitch) !== 0) {
            await this.pitch(newFile, Number(settings.pitch), false, true)
        }
        if (Number(settings.speed) !== 1) {
            await this.speed(newFile, Number(settings.speed), Boolean(settings.speedParam), false, true)
        }
        if (settings.filters[0]) {
            for (let i = 0; i < settings.filters.length; i++) {
                const params = Functions.removeDuplicates(settings.filterParams[settings.filters[i]])
                await this[settings.filters[i]](newFile, ...params)
            }
        }
        if (settings.effects[0]) {
            for (let i = 0; i < settings.effects.length; i++) {
                const params = Functions.removeDuplicates(settings.effectParams[settings.effects[i]])
                await this[settings.effects[i]](newFile, ...params)
            }
        }
        return newFile
    }

    public play = async (file: string, start?: number) => {
        const connection = this.message.guild?.voice?.connection
        if (!connection) return
        let player = connection.dispatcher
        const stream = file // await this.fx.streamOgg(file)
        if (start) {
            player = connection.play(stream, {seek: start, highWaterMark: 100})
        } else {
            player = connection.play(stream, {highWaterMark: 100})
        }
        player.setBitrate(128)
        player.setFEC(false)
        player.setPLP(1)
        if (player.paused) player.resume()
        const queue = this.getQueue() as any
        const settings = this.getSettings() as any
        if (!queue[0]) await this.queueAdd(file, file)
        queue[0].playing = true
        if (settings.looping) {
            const duration = await this.getDuration()
            if (duration < 30) {
                settings.looping = false
                this.message.channel.send("Disabled looping because the file is too short.")
            }
        }

        player.on("finish", async () => {
            const queue = this.getQueue() as any
            const settings = this.getSettings() as any
            let next: string
            let skipPlaying = false
            if (settings.looping === true) {
                next = file
                skipPlaying = true
            } else {
                queue.shift()
                next = this.next()
            }
            if (next) {
                await this.applyEffects(next)
                await this.play(next)
                let nowPlaying: string | undefined
                if (!skipPlaying) nowPlaying = await this.nowPlaying()
                if (nowPlaying) await this.message.channel.send(nowPlaying)
            } else {
                if (settings.autoplay) {
                    const defSong = defaults.songs[Math.floor(Math.random()*defaults.songs.length)]
                    const file = await this.download(defSong)
                    await this.queueAdd(defSong, file)
                    await this.applyEffects(file)
                    await this.play(file)
                    const nowPlaying = await this.nowPlaying()
                    if (nowPlaying) await this.message.channel.send(nowPlaying)
                } else {
                    connection.channel.leave()
                    this.deleteQueue()
                    return this.message.channel.send(`There are no more songs left in the queue, left the voice channel.`)
                }
            }
        })
    }

    public skip = async (num?: number) => {
        let amount = num ? num : 1
        const queue = this.getQueue() as any
        const settings = this.getSettings() as any
        settings.looping = false
        settings.ablooping = false
        if (amount > queue.length) amount = queue.length
        let i = 0
        do {
            queue.shift()
            i++
        } while (i < amount - 1)
        if (this.next()) {
            await this.applyEffects(this.next())
            await this.play(this.next())
            const nowPlaying = await this.nowPlaying()
            if (nowPlaying) await this.message.channel.send(nowPlaying)
        } else {
            if (settings.autoplay) {
                const defSong = defaults.songs[Math.floor(Math.random()*defaults.songs.length)]
                const file = await this.download(defSong)
                await this.queueAdd(defSong, file)
                await this.applyEffects(this.next())
                await this.play(this.next())
                const nowPlaying = await this.nowPlaying()
                if (nowPlaying) await this.message.channel.send(nowPlaying)
            } else {
                this.message.guild?.voice?.connection?.channel.leave()
                return this.message.channel.send(`There are no more songs in the queue, stopped playback.`)
            }
        }
    }

    public scrub = (position: string) => {
        if (position.startsWith("+")) {
            position = position.replace("+", "")
            return this.fastforward(position)
        } else if (position.startsWith("-")) {
            position = position.replace("-", "")
            return this.rewind(position)
        }
        const connection = this.message.guild?.voice?.connection
        if (!connection) return
        const seconds = this.parseSeconds(position)
        if (Number.isNaN(seconds)) return this.message.reply("Provide the time in \`00:00\` format...").then((m) => m.delete({timeout: 3000}))
        const queue = this.getQueue() as any
        return this.play(queue[0].file, seconds)
    }

    public abloop = async (start: string, end: string) => {
        const queue = this.getQueue() as any
        const settings = this.getSettings() as any
        const startSec = this.parseSeconds(start)
        const endSec = this.parseSeconds(end)
        if (Number.isNaN(startSec) || Number.isNaN(endSec)) {
            const rep = await this.message.reply("Provide the time in \`00:00\` format...")
            rep.delete({timeout: 3000})
            return
        }
        const diff = endSec - startSec
        while (settings.ablooping) {
            this.play(queue[0].file, startSec)
            await Functions.timeout(diff * 1000)
        }
    }

    public clear = () => {
        const queue = this.getQueue() as any
        const settings = this.getSettings() as any
        settings.speed = "1.0"
        settings.pitch = "0"
        settings.filters = []
        settings.effects = []
        settings.filterParams = {}
        settings.effectParams = {}
        settings.reverse = false
        settings.looping = false
        settings.ablooping = false
        queue[0].file = queue[0].originalFile
        return this.play(queue[0].originalFile)
    }

    public mp3Download = async (userID: string) => {
        const queue = this.getQueue() as any
        const file = path.join(__dirname, "..", queue[0].file)
        const attachment = new MessageAttachment(file, `${path.basename(file)}`)
        await this.message.channel.send(`<@${userID}>, Here is the download for this file!`)
        await this.message.channel.send(attachment)
        return
    }

    public parseSeconds = (input: string) => {
        let seconds = 0
        if (input?.match(/:/g)?.length === 2) {
            const arr = input.split(":")
            seconds += Number(arr[0]) * 60 * 60
            seconds += Number(arr[1]) * 60
            seconds += Number(arr[2])
        } else if (input?.match(/:/g)?.length === 1) {
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
        // @ts-ignore
        const images = results.map((r) => r.snippet.thumbnails?.maxres?.url ?? r.snippet.thumbnails.high.url)
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
        const results = await this.soundcloud.tracks.scrape(query)
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

    public parseYTDuration = (duration: string, returnSeconds?: boolean) => {
        const matches = duration?.match(/[0-9]+[HMS]/g)
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
        if (returnSeconds) {
            let s = 0
            s += Number(hours) * 60 * 60
            s += Number(minutes) * 60
            s+= Number(seconds)
            return s
        }
        const text = `${hours === "0" ? "" : `${hours}:`}${minutes}:${seconds}`
        return text
    }

    public parseSCDuration = (duration: number) => {
        duration = Number(duration)
        let seconds = Math.floor((duration / 1000) % 60) as any
        let minutes = Math.floor((duration / (1000 * 60)) % 60) as any
        let hours = Math.floor((duration / (1000 * 60 * 60)) % 24) as any

        hours = (hours === 0) ? "" : ((hours < 10) ? "0" + hours + ":" : hours + ":")
        minutes = (minutes < 10) ? "0" + minutes : minutes
        seconds = (seconds < 10) ? "0" + seconds : seconds
        return `${hours}${minutes}:${seconds}`
    }

    public equalizerMenu = async (clearProc?: boolean) => {
        if (clearProc) this.setProcBlock(true)
        const discord = this.discord
        const eqEmbed = this.embeds.createEmbed()
        eqEmbed
        .setAuthor("equalizer", "https://clipartmag.com/images/musical-notes-png-11.png")
        .setTitle(`**Audio Equalizer** ${discord.getEmoji("RaphiSmile")}`)
        .setDescription(
            `_These are the 7 different filter types that you can choose from:_\n` +
            `${discord.getEmoji("highpass")}_Highpass Filter_ -> _Removes low frequencies._\n` +
            `${discord.getEmoji("highshelf")}_Highshelf Filter_ -> _Boosts/attenuates all frequencies above the cutoff frequency._\n` +
            `${discord.getEmoji("bandpass")}_Bandpass Filter_ -> _Removes both low frequencies and high frequencies._\n` +
            `${discord.getEmoji("peak")}_Peak Filter_ -> _Carves boosts/cuts in a certain frequency range._\n` +
            `${discord.getEmoji("bandreject")}_Bandreject Filter_ -> _An inverted bandpass filter, use a high Q factor to get a notch filter._\n` +
            `${discord.getEmoji("lowshelf")}_Lowshelf Filter_ -> _Boosts/attenuates all frequencies below the cutoff frequency._\n` +
            `${discord.getEmoji("lowpass")}_Lowpass Filter_ -> _Removes high frequencies._\n` +
            `_Frequency and width are in Hz. If applicable, resonance is a Q factor and gain is in decibels._`
        )
        const msg = await this.message.channel.send(eqEmbed)
        const reactions = ["highpass", "highshelf", "bandpass", "peak", "bandreject", "lowshelf", "lowpass", "cancel"]
        for (let i = 0; i < reactions.length; i++) await msg.react(discord.getEmoji(reactions[i]))

        const highpassCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("highpass") && user.bot === false
        const highshelfCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("highshelf") && user.bot === false
        const bandpassCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("bandpass") && user.bot === false
        const peakCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("peak") && user.bot === false
        const bandrejectCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("bandreject") && user.bot === false
        const lowshelfCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("lowshelf") && user.bot === false
        const lowpassCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("lowpass") && user.bot === false
        const cancelCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("cancel") && user.bot === false
        const highpass = msg.createReactionCollector(highpassCheck)
        const highshelf = msg.createReactionCollector(highshelfCheck)
        const bandpass = msg.createReactionCollector(bandpassCheck)
        const peak = msg.createReactionCollector(peakCheck)
        const bandreject = msg.createReactionCollector(bandrejectCheck)
        const lowshelf = msg.createReactionCollector(lowshelfCheck)
        const lowpass = msg.createReactionCollector(lowpassCheck)
        const cancel = msg.createReactionCollector(cancelCheck)

        const pass = ["highpass", "bandpass", "bandreject", "lowpass"]
        const passCol = [highpass, bandpass, bandreject, lowpass]
        const shelf = ["highshelf", "lowshelf"]
        const shelfCol = [highshelf, lowshelf]

        await new Promise((resolve) => {
        for (let i = 0; i < pass.length; i++) {
            passCol[i].on("collect", async (reaction, user) => {
                if (this.getProcBlock()) {
                    await reaction.users.remove(user)
                    const proc = await this.message.channel.send(`<@${user.id}>, Please wait until the current effect is done processing before adding another.`)
                    proc.delete({timeout: 3000})
                    return
                }
                this.setProcBlock()
                await reaction.users.remove(user)
                let freq = 600
                let width = 100
                async function getParams(response: Message) {
                    const rArgs = response.content.split(" ")
                    freq = Number(rArgs[0])
                    width = Number(rArgs[1])
                    await response.delete()
                }
                const rep = await this.message.channel.send(`<@${user.id}>, Enter the cutoff frequency and filter width (in Hz).`)
                await this.embeds.createPrompt(getParams)
                rep.delete()
                const settings = this.getSettings() as any
                const queue = this.getQueue() as any
                settings.filters.push(pass[i])
                const rep3 = await this.message.channel.send(`<@${user.id}>, Adding a ${pass[i]} filter, please wait...`)
                await this[pass[i]](queue[0].file, freq, width, false)
                rep3.delete()
                const rep2 = await this.message.channel.send(`<@${user.id}>, Added a ${pass[i]} filter!`)
                rep2.delete({timeout: 3000})
                this.setProcBlock(true)
                resolve()
            })
        }

        for (let i = 0; i < shelf.length; i++) {
            shelfCol[i].on("collect", async (reaction, user) => {
                if (this.getProcBlock()) {
                    await reaction.users.remove(user)
                    const proc = await this.message.channel.send(`<@${user.id}>, Please wait until the current effect is done processing before adding another.`)
                    proc.delete({timeout: 3000})
                    return
                }
                this.setProcBlock()
                await reaction.users.remove(user)
                let gain = 3
                let freq = 600
                let width = 100
                async function getParams(response: Message) {
                    const rArgs = response.content.split(" ")
                    gain = Number(rArgs[0])
                    freq = Number(rArgs[1])
                    width = Number(rArgs[2])
                    await response.delete()
                }
                const rep = await this.message.channel.send(`<@${user.id}>, Enter the gain (in decibels), the cutoff frequency, and the filter width (in Hz).`)
                await this.embeds.createPrompt(getParams)
                rep.delete()
                const settings = this.getSettings() as any
                const queue = this.getQueue() as any
                settings.filters.push(shelf[i])
                const rep3 = await this.message.channel.send(`<@${user.id}>, Adding a ${shelf[i]} filter, please wait...`)
                await this[pass[i]](queue[0].file, gain, freq, width, false)
                rep3.delete()
                const rep2 = await this.message.channel.send(`<@${user.id}>, Added a ${shelf[i]} filter!`)
                rep2.delete({timeout: 3000})
                this.setProcBlock(true)
                resolve()
            })
        }

        peak.on("collect", async (reaction, user) => {
            if (this.getProcBlock()) {
                await reaction.users.remove(user)
                const proc = await this.message.channel.send(`<@${user.id}>, Please wait until the current effect is done processing before adding another.`)
                proc.delete({timeout: 3000})
                return
            }
            this.setProcBlock()
            await reaction.users.remove(user)
            let freq = 1000
            let resonance = 2
            let gain = 3
            async function getParams(response: Message) {
                const rArgs = response.content.split(" ")
                gain= Number(rArgs[0])
                freq = Number(rArgs[1])
                resonance = Number(rArgs[2])
                await response.delete()
            }
            const rep = await this.message.channel.send(`<@${user.id}>, Enter the gain (in decibels), the cutoff frequency (in Hz), and the resonance (Q Factor).`)
            await this.embeds.createPrompt(getParams)
            rep.delete()
            const settings = this.getSettings() as any
            const queue = this.getQueue() as any
            settings.filters.push("peak")
            const rep3 = await this.message.channel.send(`<@${user.id}>, Adding a peak filter, please wait...`)
            await this.peak(queue[0].file, freq, resonance, gain)
            rep3.delete()
            const rep2 = await this.message.channel.send(`<@${user.id}>, Added a peak filter!`)
            rep2.delete({timeout: 3000})
            this.setProcBlock(true)
            resolve()
        })
        cancel.on("collect", (reaction, user) => {
            resolve()
        })
        })
        return msg
    }

    public fxMenu = async (clearProc?: boolean) => {
        if (clearProc) this.setProcBlock()
        const discord = this.discord
        const fxEmbed = this.embeds.createEmbed()
        .setAuthor("effects", "https://clipartmag.com/images/musical-notes-png-11.png")
        .setTitle(`**Special Effects** ${discord.getEmoji("RaphiSmile")}`)
        .setDescription(
            `_There are 11 different audio effects that you can add:_\n` +
            `${discord.getEmoji("reverb")}_Reverb_ -> _Emulates room reflections._\n` +
            `${discord.getEmoji("delay")}_Delay_ -> _Repeatedly replays the signal after a certain delay._\n` +
            `${discord.getEmoji("chorus")}_Chorus_ -> _Mixes the signal with delayed, pitch modulated copies._\n` +
            `${discord.getEmoji("phaser")}_Phaser_ -> _Modulates allpass filters for a phase cancellation effect._\n` +
            `${discord.getEmoji("flanger")}_Flanger_ -> _Modulates comb filters with a very short delay time._\n` +
            `${discord.getEmoji("bitcrush")}_Bitcrush_ -> _Decreases the sample rate._\n` +
            `${discord.getEmoji("upsample")}_Upsample_ -> _Increases the sample rate._\n` +
            `${discord.getEmoji("distortion")}_Distortion_ -> _Soft clips the audio._\n` +
            `${discord.getEmoji("compression")}_Compression_ -> _Reduces the dynamic range._\n` +
            `${discord.getEmoji("allpass")}_Allpass Filter_ -> _Changes the phase relationship of frequencies._\n` +
            `${discord.getEmoji("tremolo")}_Tremelo_ -> _Amplitude modulation with an LFO._`
        )
        const reactions = ["reverb", "delay", "chorus", "phaser", "flanger", "bitcrush", "upsample", "distortion", "compression", "allpass", "tremolo", "cancel"]
        const msg = await this.message.channel.send(fxEmbed)
        for (let i = 0; i < reactions.length; i++) await msg.react(discord.getEmoji(reactions[i]))

        const reverbCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("reverb") && user.bot === false
        const delayCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("delay") && user.bot === false
        const chorusCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("chorus") && user.bot === false
        const phaserCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("phaser") && user.bot === false
        const flangerCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("flanger") && user.bot === false
        const bitcrushCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("bitcrush") && user.bot === false
        const upsampleCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("upsample") && user.bot === false
        const distortionCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("distortion") && user.bot === false
        const compressionCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("compression") && user.bot === false
        const allpassCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("allpass") && user.bot === false
        const tremoloCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("tremolo") && user.bot === false
        const cancelCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("cancel") && user.bot === false
        const reverb = msg.createReactionCollector(reverbCheck)
        const delay = msg.createReactionCollector(delayCheck)
        const chorus = msg.createReactionCollector(chorusCheck)
        const phaser = msg.createReactionCollector(phaserCheck)
        const flanger = msg.createReactionCollector(flangerCheck)
        const bitcrush = msg.createReactionCollector(bitcrushCheck)
        const upsample = msg.createReactionCollector(upsampleCheck)
        const distortion = msg.createReactionCollector(distortionCheck)
        const compression = msg.createReactionCollector(compressionCheck)
        const allpass = msg.createReactionCollector(allpassCheck)
        const tremolo = msg.createReactionCollector(tremoloCheck)
        const cancel = msg.createReactionCollector(cancelCheck)
        let argArray: any[] = []
        async function parseArgs(response: Message) {
            const rArgs = response.content.split(" ")
            argArray = rArgs
            await response.delete()
            return rArgs
        }
        await new Promise((resolve) => {
        reverb.on("collect", async (reaction, user) => {
            if (this.getProcBlock()) {
                await reaction.users.remove(user)
                const proc = await this.message.channel.send(`<@${user.id}>, Please wait until the current effect is done processing before adding another.`)
                proc.delete({timeout: 3000})
                return
            }
            this.setProcBlock()
            await reaction.users.remove(user)
            const rep = await this.message.channel.send(`<@${user.id}>, Enter the amount, damping, room, stereo, pre-delay, and wet-gain.`)
            await this.embeds.createPrompt(parseArgs)
            const amount = Number(argArray[0])
            const damping = Number(argArray[1])
            const room = Number(argArray[2])
            const stereo = Number(argArray[3])
            const preDelay = Number(argArray[4])
            const wetGain = Number(argArray[5])
            const reverse = Boolean(argArray[6])
            rep.delete()
            const settings = this.getSettings() as any
            const queue = this.getQueue() as any
            settings.effects.push("reverb")
            const file = queue[0].file
            const rep2 = await this.message.channel.send(`<@${user.id}>, Adding reverb, please wait...`)
            await this.reverb(file, amount, damping, room, stereo, preDelay, wetGain, reverse, false)
            rep2.delete()
            const rep3 = await this.message.channel.send(`<@${user.id}>, Added reverb!`)
            rep3.delete({timeout: 3000})
            this.setProcBlock(true)
            resolve()
        })

        delay.on("collect", async (reaction, user) => {
            if (this.getProcBlock()) {
                await reaction.users.remove(user)
                const proc = await this.message.channel.send(`<@${user.id}>, Please wait until the current effect is done processing before adding another.`)
                proc.delete({timeout: 3000})
                return
            }
            this.setProcBlock()
            await reaction.users.remove(user)
            const rep = await this.message.channel.send(`<@${user.id}>, Enter pairs of delay and decay times.`)
            await this.embeds.createPrompt(parseArgs)
            const delaysDecays = argArray.map((a) => Number(a) ? Number(a) : 0)
            if (delaysDecays.length % 2 === 1) delaysDecays.push(0)
            rep.delete()
            const settings = this.getSettings() as any
            const queue = this.getQueue() as any
            settings.effects.push("delay")
            const file = queue[0].file
            const rep2 = await this.message.channel.send(`<@${user.id}>, Adding delay, please wait...`)
            await this.delay(file, delaysDecays, false)
            rep2.delete()
            const rep3 = await this.message.channel.send(`<@${user.id}>, Added delay!`)
            rep3.delete({timeout: 3000})
            this.setProcBlock(true)
            resolve()
        })

        chorus.on("collect", async (reaction, user) => {
            if (this.getProcBlock()) {
                await reaction.users.remove(user)
                const proc = await this.message.channel.send(`<@${user.id}>, Please wait until the current effect is done processing before adding another.`)
                proc.delete({timeout: 3000})
                return
            }
            this.setProcBlock()
            await reaction.users.remove(user)
            const rep = await this.message.channel.send(`<@${user.id}>, Enter the delay, decay, speed, and depth.`)
            await this.embeds.createPrompt(parseArgs)
            const delay = Number(argArray[0])
            const decay = Number(argArray[1])
            const speed = Number(argArray[2])
            const depth = Number(argArray[3])
            rep.delete()
            const settings = this.getSettings() as any
            const queue = this.getQueue() as any
            settings.effects.push("chorus")
            const file = queue[0].file
            const rep2 = await this.message.channel.send(`<@${user.id}>, Adding chorus, please wait...`)
            await this.chorus(file, delay, decay, speed, depth, false)
            rep2.delete()
            const rep3 = await this.message.channel.send(`<@${user.id}>, Added chorus!`)
            rep3.delete({timeout: 3000})
            this.setProcBlock(true)
            resolve()
        })

        phaser.on("collect", async (reaction, user) => {
            if (this.getProcBlock()) {
                await reaction.users.remove(user)
                const proc = await this.message.channel.send(`<@${user.id}>, Please wait until the current effect is done processing before adding another.`)
                proc.delete({timeout: 3000})
                return
            }
            this.setProcBlock()
            await reaction.users.remove(user)
            const rep = await this.message.channel.send(`<@${user.id}>, Enter the delay, decay, and speed.`)
            await this.embeds.createPrompt(parseArgs)
            const delay = Number(argArray[0])
            const decay = Number(argArray[1])
            const speed = Number(argArray[2])
            rep.delete()
            const settings = this.getSettings() as any
            const queue = this.getQueue() as any
            settings.effects.push("phaser")
            const file = queue[0].file
            const rep2 = await this.message.channel.send(`<@${user.id}>, Adding phaser, please wait...`)
            await this.phaser(file, delay, decay, speed, false)
            rep2.delete()
            const rep3 = await this.message.channel.send(`<@${user.id}>, Added phaser!`)
            rep3.delete({timeout: 3000})
            this.setProcBlock(true)
            resolve()
        })

        flanger.on("collect", async (reaction, user) => {
            if (this.getProcBlock()) {
                await reaction.users.remove(user)
                const proc = await this.message.channel.send(`<@${user.id}>, Please wait until the current effect is done processing before adding another.`)
                proc.delete({timeout: 3000})
                return
            }
            this.setProcBlock()
            await reaction.users.remove(user)
            const rep = await this.message.channel.send(`<@${user.id}>, Enter the delay, depth, regen, width, speed, shape, phase, and interp.`)
            await this.embeds.createPrompt(parseArgs)
            const delay = Number(argArray[0])
            const depth = Number(argArray[1])
            const regen = Number(argArray[2])
            const width = Number(argArray[3])
            const speed = Number(argArray[4])
            const shape = argArray[5]
            const phase = Number(argArray[6])
            const interp = argArray[7]
            rep.delete()
            const settings = this.getSettings() as any
            const queue = this.getQueue() as any
            settings.effects.push("flanger")
            const file = queue[0].file
            const rep2 = await this.message.channel.send(`<@${user.id}>, Adding flanger, please wait...`)
            await this.flanger(file, delay, depth, regen, width, speed, shape, phase, interp, false)
            rep2.delete()
            const rep3 = await this.message.channel.send(`<@${user.id}>, Added flanger!`)
            rep3.delete({timeout: 3000})
            this.setProcBlock(true)
            resolve()
        })

        bitcrush.on("collect", async (reaction, user) => {
            if (this.getProcBlock()) {
                await reaction.users.remove(user)
                const proc = await this.message.channel.send(`<@${user.id}>, Please wait until the current effect is done processing before adding another.`)
                proc.delete({timeout: 3000})
                return
            }
            this.setProcBlock()
            await reaction.users.remove(user)
            const rep = await this.message.channel.send(`<@${user.id}>, Enter the bitcrush factor.`)
            await this.embeds.createPrompt(parseArgs)
            const factor = Number(argArray[0])
            rep.delete()
            const settings = this.getSettings() as any
            const queue = this.getQueue() as any
            settings.effects.push("bitcrush")
            const file = queue[0].file
            const rep2 = await this.message.channel.send(`<@${user.id}>, Adding bitcrushing, please wait...`)
            await this.bitcrush(file, factor, false)
            rep2.delete()
            const rep3 = await this.message.channel.send(`<@${user.id}>, Added bitcrushing!`)
            rep3.delete({timeout: 3000})
            this.setProcBlock(true)
            resolve()
        })

        upsample.on("collect", async (reaction, user) => {
            if (this.getProcBlock()) {
                await reaction.users.remove(user)
                const proc = await this.message.channel.send(`<@${user.id}>, Please wait until the current effect is done processing before adding another.`)
                proc.delete({timeout: 3000})
                return
            }
            this.setProcBlock()
            await reaction.users.remove(user)
            const rep = await this.message.channel.send(`<@${user.id}>, Enter the upsample factor.`)
            await this.embeds.createPrompt(parseArgs)
            const factor = Number(argArray[0])
            rep.delete()
            const settings = this.getSettings() as any
            const queue = this.getQueue() as any
            settings.effects.push("upsample")
            const file = queue[0].file
            const rep2 = await this.message.channel.send(`<@${user.id}>, Adding upsampling, please wait...`)
            await this.upsample(file, factor, false)
            rep2.delete()
            const rep3 = await this.message.channel.send(`<@${user.id}>, Added upsampling!`)
            rep3.delete({timeout: 3000})
            this.setProcBlock(true)
            resolve()
        })

        distortion.on("collect", async (reaction, user) => {
            if (this.getProcBlock()) {
                await reaction.users.remove(user)
                const proc = await this.message.channel.send(`<@${user.id}>, Please wait until the current effect is done processing before adding another.`)
                proc.delete({timeout: 3000})
                return
            }
            this.setProcBlock()
            await reaction.users.remove(user)
            const rep = await this.message.channel.send(`<@${user.id}>, Enter the gain and color.`)
            await this.embeds.createPrompt(parseArgs)
            const gain = Number(argArray[0])
            const color = Number(argArray[1])
            rep.delete()
            const settings = this.getSettings() as any
            const queue = this.getQueue() as any
            settings.effects.push("distortion")
            const file = queue[0].file
            const rep2 = await this.message.channel.send(`<@${user.id}>, Adding distortion, please wait...`)
            await this.distortion(file, gain, color, false)
            rep2.delete()
            const rep3 = await this.message.channel.send(`<@${user.id}>, Added distortion!`)
            rep3.delete({timeout: 3000})
            this.setProcBlock(true)
            resolve()
        })

        compression.on("collect", async (reaction, user) => {
            if (this.getProcBlock()) {
                await reaction.users.remove(user)
                const proc = await this.message.channel.send(`<@${user.id}>, Please wait until the current effect is done processing before adding another.`)
                proc.delete({timeout: 3000})
                return
            }
            this.setProcBlock()
            await reaction.users.remove(user)
            const rep = await this.message.channel.send(`<@${user.id}>, Enter the compression amount (0-100).`)
            await this.embeds.createPrompt(parseArgs)
            const amount = Number(argArray[0])
            rep.delete()
            const settings = this.getSettings() as any
            const queue = this.getQueue() as any
            settings.effects.push("compression")
            const file = queue[0].file
            const rep2 = await this.message.channel.send(`<@${user.id}>, Adding compression, please wait...`)
            await this.compression(file, amount, false)
            rep2.delete()
            const rep3 = await this.message.channel.send(`<@${user.id}>, Added compression!`)
            rep3.delete({timeout: 3000})
            this.setProcBlock(true)
            resolve()
        })

        allpass.on("collect", async (reaction, user) => {
            if (this.getProcBlock()) {
                await reaction.users.remove(user)
                const proc = await this.message.channel.send(`<@${user.id}>, Please wait until the current effect is done processing before adding another.`)
                proc.delete({timeout: 3000})
                return
            }
            this.setProcBlock()
            await reaction.users.remove(user)
            const rep = await this.message.channel.send(`<@${user.id}>, Enter the frequency and width.`)
            await this.embeds.createPrompt(parseArgs)
            const freq = Number(argArray[0])
            const width = Number(argArray[1])
            rep.delete()
            const settings = this.getSettings() as any
            const queue = this.getQueue() as any
            settings.effects.push("allpass")
            const file = queue[0].file
            const rep2 = await this.message.channel.send(`<@${user.id}>, Adding an allpass filter, please wait...`)
            await this.allPass(file, freq, width, false)
            rep2.delete()
            const rep3 = await this.message.channel.send(`<@${user.id}>, Added an allpass filter!`)
            rep3.delete({timeout: 3000})
            this.setProcBlock(true)
            resolve()
        })

        tremolo.on("collect", async (reaction, user) => {
            if (this.getProcBlock()) {
                await reaction.users.remove(user)
                const proc = await this.message.channel.send(`<@${user.id}>, Please wait until the current effect is done processing before adding another.`)
                proc.delete({timeout: 3000})
                return
            }
            this.setProcBlock()
            await reaction.users.remove(user)
            const rep = await this.message.channel.send(`<@${user.id}>, Enter the speed and depth.`)
            await this.embeds.createPrompt(parseArgs)
            const speed = Number(argArray[0])
            const depth = Number(argArray[1])
            rep.delete()
            const settings = this.getSettings() as any
            const queue = this.getQueue() as any
            settings.effects.push("tremolo")
            const file = queue[0].file
            const rep2 = await this.message.channel.send(`<@${user.id}>, Adding tremolo, please wait...`)
            await this.tremolo(file, speed, depth, false)
            rep2.delete()
            const rep3 = await this.message.channel.send(`<@${user.id}>, Added tremolo!`)
            rep3.delete({timeout: 3000})
            this.setProcBlock(true)
            resolve()
        })
        cancel.on("collect", (reaction, user) => {
            resolve()
        })
        })
        return msg
    }
}
