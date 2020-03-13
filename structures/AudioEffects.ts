import axios from "axios"
import child_process from "child_process"
import {Message, MessageAttachment} from "discord.js"
import ffmpeg from "fluent-ffmpeg"
import fs from "fs"
import path from "path"
import sox from "sox-stream"
import stream from "stream"
import util from "util"
import {Embeds} from "./Embeds"
import {Functions} from "./Functions"
import {Images} from "./Images"
import {Kisaragi} from "./Kisaragi"

const pipeline = util.promisify(stream.pipeline)
export class AudioEffects {
    private readonly headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}
    private readonly images = new Images(this.discord, this.message)
    private readonly embeds = new Embeds(this.discord, this.message)
    constructor(private readonly discord: Kisaragi, private readonly message: Message) {}

    public getDir = () => {
        const dir = child_process.execSync("cd")
        return `${dir}/`.replace(/\\/g, "/").trim()
    }

    public init = (remove?: boolean) => {
        if (remove) Functions.removeDirectory(`./tracks/transform`)
        if (!fs.existsSync(`./tracks/transform`)) fs.mkdirSync(`./tracks/transform`, {recursive: true})
    }

    public processEffect = async (effect: string, filepath: string, fileDest: string) => {
        this.init()
        if (filepath.includes("https://") || filepath.includes("http://")) {
            const data = await axios.get(filepath, {responseType: "arraybuffer", headers: this.headers}).then((r) => r.data)
            const filename = path.basename(filepath.replace(`_${effect}`, "")).slice(0, -4)
            const dest = `./tracks/${filename}_${effect}.${filepath.slice(-3)}`
            fs.writeFileSync(dest, data, "binary")
            filepath = dest
        }
        const ext = path.extname(filepath).replace(".", "")
        let outDest = fileDest + `.${ext}`
        let index = 0
        while (fs.existsSync(outDest)) {
            outDest = index === 0 ? `${fileDest}.${ext}` : `${fileDest}${index}.${ext}`
            index++
        }
        const input = fs.createReadStream(filepath)
        const output = fs.createWriteStream(outDest)
        const transform = sox({
            global: {
                "temp": "./temp",
                "replay-gain": "off"
            },
            input: {type: ext},
            output: {type: ext},
            effects: ["gain", "-h", ...effect.split(" ")]
        })
        await new Promise((resolve) => {
            input.pipe(transform).pipe(output)
            .on("finish", () => resolve())
        })
        return outDest
    }

    public downloadEffect = async (effect: string, filepath: string) => {
        const ext = path.extname(filepath)
        const filename = path.basename(filepath.replace(`_${effect}`, "")).slice(0, -4)
        const fileDest = `./tracks/transform/${filename}_${effect}${ext}`
        const stats = fs.statSync(fileDest)
        if (stats.size > 8000000) {
            const link = await this.images.fileIOUpload(fileDest)
            const effectEmbed = this.embeds.createEmbed()
            effectEmbed
            .setAuthor("audio effect", "https://clipartmag.com/images/musical-notes-png-11.png")
            .setTitle(`**Audio Effect Download** ${this.discord.getEmoji("kannaWave")}`)
            .setDescription(
                `${this.discord.getEmoji("star")}This file is too large for attachments. Please note that the following link **will get deleted after someone downloads it**.\n` +
                link
            )
            return this.message.channel.send(effectEmbed)
        } else {
            const attachName = path.basename(fileDest)
            const attachment = new MessageAttachment(fileDest, `${attachName}`)
            const effectEmbed = this.embeds.createEmbed()
            effectEmbed
            .setAuthor("audio effect", "https://clipartmag.com/images/musical-notes-png-11.png")
            .setTitle(`**Audio Effect Download** ${this.discord.getEmoji("kannaWave")}`)
            .setDescription(
                `${this.discord.getEmoji("star")}Applied the **${effect}** effect to this mp3 file!\n`
            )
            await this.message.channel.send(effectEmbed)
            return this.message.channel.send(attachment)
        }
    }

    public multibandcompressor = async (attacks: number[], decays: number[], knees: number[], gains: number[], crossovers: number[], filepath: string, fileDest: string) => {
        let effect = ""
        for (let i = 0; i < attacks.length; i++) {
            effect += `"${attacks[i]} ${decays[i]} ${knees[i]} ${gains[i]}" ${crossovers[i]} \\\n`
        }
        return this.processEffect(`mcompand ${effect}`, filepath, fileDest)
    }

    public compress = async (amount: number, filepath: string, fileDest: string) => {
        return this.processEffect(`contrast ${amount}`, filepath, fileDest)
    }

    public tremolo = async (speed: number, depth: number, filepath: string, fileDest: string) => {
        return this.processEffect(`tremolo ${speed} ${depth}`, filepath, fileDest)
    }

    public lowpass = async (freq: number, width: number, filepath: string, fileDest: string) => {
        return this.processEffect(`highpass ${freq} ${width}`, filepath, fileDest)
    }

    public highpass = async (freq: number, width: number, filepath: string, fileDest: string) => {
        return this.processEffect(`highpass ${freq} ${width}`, filepath, fileDest)
    }

    public equalizer = async (freq: number, resonance: number, gain: number, filepath: string, fileDest: string) => {
        return this.processEffect(`equalizer ${freq} ${resonance} ${gain}`, filepath, fileDest)
    }

    public bass = async (gain: number, freq: number, width: number, filepath: string, fileDest: string) => {
        return this.processEffect(`bass ${gain} ${freq} ${width}`, filepath, fileDest)
    }

    public treble = async (gain: number, freq: number, width: number, filepath: string, fileDest: string) => {
        return this.processEffect(`treble ${gain} ${freq} ${width}`, filepath, fileDest)
    }

    public bandpass = async (freq: number, width: number, filepath: string, fileDest: string) => {
        return this.processEffect(`bandpass ${freq} ${width}`, filepath, fileDest)
    }

    public bandreject = async (freq: number, width: number, filepath: string, fileDest: string) => {
        return this.processEffect(`bandreject ${freq} ${width}`, filepath, fileDest)
    }

    public upsample = async (factor: number, filepath: string, fileDest: string) => {
        return this.processEffect(`upsample ${factor}`, filepath, fileDest)
    }

    public bitcrush = async (factor: number, filepath: string, fileDest: string) => {
        return this.processEffect(`downsample ${factor}`, filepath, fileDest)
    }

    public distortion = async (gain: number, color: number, filepath: string, fileDest: string) => {
        return this.processEffect(`overdrive ${gain} ${color}`, filepath, fileDest)
    }

    public chorus = async (delay: number, decay: number, speed: number, depth: number, filepath: string, fileDest: string) => {
        return this.processEffect(`chorus 0.9 0.87 ${delay} ${decay} ${speed} ${depth}`, filepath, fileDest)
    }

    public phaser = async (delay: number, decay: number, speed: number, filepath: string, fileDest: string) => {
        return this.processEffect(`phaser 0.9 0.87 ${delay} ${decay} ${speed}`, filepath, fileDest)
    }

    public flanger = async (delay: number, depth: number, regen: number, width: number, speed: number, shape: number, phase: number, interp: number, filepath: string, fileDest: string) => {
        return this.processEffect(`flanger ${delay} ${depth} ${regen} ${width} ${speed} ${shape} ${phase} ${interp}`, filepath, fileDest)
    }

    public delay = async (delaysDecays: number[], filepath: string, fileDest: string) => {
        return this.processEffect(`echo ${delaysDecays.join(" ")}`, filepath, fileDest)
    }

    public pitch = async (pitch: number, filepath: string, fileDest: string) => {
        const cents = pitch * 100
        return this.processEffect(`pitch ${cents}`, filepath, fileDest)
    }

    public speed = async (factor: number, pitch: boolean, filepath: string, fileDest: string) => {
        let effect = `tempo ${factor}`
        if (pitch) effect = `speed ${factor}`
        return this.processEffect(effect, filepath, fileDest)
    }

    public reverse = async (filepath: string, fileDest: string) => {
        return this.processEffect("reverse", filepath, fileDest)
    }

    public reverb = async (reverb: number, damping: number, room: number, stereo: number, preDelay: number, wetGain: number, reverse: boolean, filepath: string, fileDest: string) => {
        let effect = `pad 0 3 reverb ${reverb} ${damping} ${room} ${stereo} ${preDelay} ${wetGain}`
        if (reverse) {
            effect = `"|sox ${filepath} -p reverse reverb -w ${reverb} ${damping} ${room} ${stereo} ${preDelay} ${wetGain} reverse`
        }
        return this.processEffect(effect, filepath, fileDest)
    }

    public allPass = async (freq: number, width: number, filepath: string, fileDest: string) => {
        return this.processEffect(`gain -12 allpass ${freq} ${width} gain -n`, filepath, fileDest)
    }

    public combFilter = async (delay: number, decay: number, filepath: string, wavDest?: string) => {
        this.init()
        const wavFile = await this.mp3ToWav(filepath)
        const arraybuffer = fs.readFileSync(wavFile, null).buffer
        const array = new Uint8Array(arraybuffer)
        const header = array.slice(0, 44)
        const samples = array.slice(44)
        const {sampleRate, byteDepth} = this.getWavInfo(header)
        const bufferSize = samples.length * byteDepth
        const delaySamples = Math.floor(delay * (sampleRate/1000))
        const combSamples = [...samples.slice()]
        for (let i = 0; i < bufferSize; i++) {
            if (combSamples.length === bufferSize) break
            combSamples.push(0)
        }
        for (let i = 0; i < bufferSize - delaySamples; i++) {
            combSamples[i + delaySamples] += Number(combSamples[i] * decay)
        }
        if (!wavDest) return combSamples
        const combArray = [...header, ...combSamples]
        fs.writeFileSync(wavDest, Buffer.from(new Uint8Array(combArray)))
        const mp3File = await this.WavToMp3(wavDest)
        fs.unlink(wavFile, (err) => console.log(err))
        fs.unlink(wavDest, (err) => console.log(err))
        return mp3File
    }

    public mp3ToWav = async (filepath: string) => {
        this.init()
        const filename = path.basename(filepath).slice(0, -4)
        const newDest = `./tracks/transform/${filename}.wav`
        await new Promise((resolve) => {
            ffmpeg(filepath).toFormat("wav").outputOptions("-bitexact").save(newDest)
            .on("end", () => {
                resolve()
            })
        })
        return newDest
    }

    public WavToMp3 = async (filepath: string) => {
        this.init()
        const filename = path.basename(filepath).slice(0, -4)
        const newDest = `./tracks/transform/${filename}.mp3`
        await new Promise((resolve) => {
            ffmpeg(filepath).toFormat("mp3").save(newDest)
            .on("end", () => {
                resolve()
            })
        })
        return newDest
    }

    public getWavInfo = (header: Uint8Array) => {
        function int32ToDec(bin: string) {
            const binArr = bin.split("-")
            let binDigits = ""
            for (let i = 0; i < binArr.length; i++) {
                binDigits += ("00000000"+Number(binArr[i]).toString(2)).slice(-8)
            }
            const num = parseInt(binDigits, 2)
            return num
        }
        let littleEndian = false
        let bitDepth = 0
        let sampleRate = 0
        let channels = 0
        let topCode = ""
        for (let i = 0; i < 4; i++) {
            topCode += String.fromCharCode(header[i])
        }
        if (topCode === "RIFF") {
            littleEndian = true
        }
        if (littleEndian) {
            bitDepth = Number(`${header[35]}${header[34]}`)
            sampleRate = Number(int32ToDec(`${(header[27])}-${(header[26])}-${(header[25])}-${(header[24])}`))
            channels = Number(`${header[23]}${header[22]}`)
        } else {
            bitDepth = Number(`${header[34]}${header[35]}`)
            sampleRate = Number(int32ToDec(`${header[24]}-${(header[25])}-${(header[26])}-${(header[27])}`))
            channels = Number(`${header[22]}${header[23]}`)
        }
        const byteDepth = (bitDepth) / 8
        return {byteDepth, bitDepth, sampleRate, channels}
    }

    public reverseLegacy = async (filepath: string, wavDest: string) => {
        this.init()
        const wavFile = await this.mp3ToWav(filepath)
        const arraybuffer = fs.readFileSync(wavFile, null).buffer
        const array = new Uint8Array(arraybuffer)
        const header = array.slice(0, 44)
        const samples = array.slice(44)
        const {byteDepth} = this.getWavInfo(header)
        let identifier = 0
        const reversed = samples.slice()
        for (let i = 0; i < samples.length; i++) {
            if (i !== 0 && (i % byteDepth === 0)) {
                identifier += 2 * byteDepth
            }
            const index = samples.length - byteDepth - identifier + i
            reversed[i] = samples[index]
        }
        const reversedArray = [...header, ...reversed]
        fs.writeFileSync(wavDest, Buffer.from(new Uint8Array(reversedArray)))
        const mp3File = await this.WavToMp3(wavDest)
        fs.unlink(wavFile, (err) => console.log(err))
        fs.unlink(wavDest, (err) => console.log(err))
        return mp3File
    }
}
