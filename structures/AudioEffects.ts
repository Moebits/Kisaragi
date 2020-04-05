import axios from "axios"
import {reject} from "bluebird"
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
        const dir = path.join(__dirname, `../tracks/transform`)
        if (remove) Functions.removeDirectory(dir)
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive: true})
    }

    public processEffect = async (effect: string, filepath: string, fileDest: string) => {
        this.init()
        if (filepath.includes("https://") || filepath.includes("http://")) {
            const data = await axios.get(filepath, {responseType: "arraybuffer", headers: this.headers}).then((r) => r.data)
            const filename = path.basename(filepath.replace(`_${effect}`, "")).slice(0, -4)
            const dest = path.join(__dirname, `../tracks/${filename}_${effect}.${filepath.slice(-3)}`)
            fs.writeFileSync(dest, data, "binary")
            filepath = dest
        }
        const inDest = await this.convertToFormat(filepath, "aiff")
        // const ext = path.extname(filepath).replace(".", "")
        let outDest = fileDest.slice(0, -4) + `.aiff`
        let index = 0
        while (fs.existsSync(outDest)) {
            outDest = index <= 1 ? `${fileDest}.aiff` : `${fileDest}${index}.aiff`
            index++
        }
        // console.log([...effect.split(" ")])
        const input = fs.createReadStream(inDest)
        const output = fs.createWriteStream(outDest)
        const transform = sox({
            global: {
                "temp": "./tracks/transform",
                "replay-gain": "off"
            },
            input: {type: "aiff"},
            output: {type: "aiff"},
            effects: ["gain", "-h", ...effect.split(" ")]
        })
        await new Promise((resolve) => {
            input
            .on("error", (err) => console.log(err))
            .pipe(transform)
            .on("error", (err) => console.log(err))
            .pipe(output)
            .on("error", (err) => console.log(err))
            .on("finish", () => resolve())
        })
        const mp3Dest = await this.convertToFormat(outDest, "mp3")
        fs.unlink(inDest, () => null)
        fs.unlink(outDest, () => null)
        return mp3Dest
    }

    public downloadEffect = async (effect: string, filepath: string) => {
        this.init()
        const ext = path.extname(filepath)
        const filename = path.basename(filepath.replace(`_${effect}`, "")).slice(0, -4)
        const fileDest = path.join(__dirname, `../tracks/transform/${filename}_${effect}${ext}`)
        const stats = fs.statSync(fileDest)
        if (stats.size > 8000000) {
            const link = await this.images.upload(fileDest)
            const effectEmbed = this.embeds.createEmbed()
            effectEmbed
            .setAuthor("audio effect", "https://clipartmag.com/images/musical-notes-png-11.png")
            .setTitle(`**Audio Effect Download** ${this.discord.getEmoji("kannaWave")}`)
            .setDescription(
                `${this.discord.getEmoji("star")}This audio file is too large for attachments. Download it [**here**](${link}).\n`
            )
            return this.message.channel.send(effectEmbed)
        } else {
            const attachName = path.basename(fileDest)
            const attachment = new MessageAttachment(path.join(__dirname, fileDest), `${attachName}`)
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

    public compress = async (amount: number, filepath: string, fileDest: string) => {
        return this.processEffect(`gain -50 contrast ${amount} gain -n`, filepath, fileDest)
    }

    public tremolo = async (speed: number, depth: number, filepath: string, fileDest: string) => {
        return this.processEffect(`tremolo ${speed} ${depth}`, filepath, fileDest)
    }

    public lowpass = async (freq: number, width: number, filepath: string, fileDest: string) => {
        return this.processEffect(`gain -50 lowpass ${freq} ${width}h gain -n`, filepath, fileDest)
    }

    public highpass = async (freq: number, width: number, filepath: string, fileDest: string) => {
        return this.processEffect(`gain -50 highpass ${freq} ${width}h gain -n`, filepath, fileDest)
    }

    public peak = async (freq: number, resonance: number, gain: number, filepath: string, fileDest: string) => {
        return this.processEffect(`gain -50 equalizer ${freq} ${resonance} ${gain} gain -n`, filepath, fileDest)
    }

    public lowshelf = async (gain: number, freq: number, width: number, filepath: string, fileDest: string) => {
        return this.processEffect(`gain -50 bass ${gain} ${freq} ${width}h gain -n`, filepath, fileDest)
    }

    public highshelf = async (gain: number, freq: number, width: number, filepath: string, fileDest: string) => {
        return this.processEffect(`gain -50 treble ${gain} ${freq} ${width}h gain -n`, filepath, fileDest)
    }

    public bandpass = async (freq: number, width: number, filepath: string, fileDest: string) => {
        return this.processEffect(`gain -50 bandpass ${freq} ${width} gain -n`, filepath, fileDest)
    }

    public bandreject = async (freq: number, width: number, filepath: string, fileDest: string) => {
        return this.processEffect(`gain -50 bandreject ${freq} ${width} gain -n`, filepath, fileDest)
    }

    public upsample = async (factor: number, filepath: string, fileDest: string) => {
        return this.processEffect(`gain -50 upsample ${factor} gain -n`, filepath, fileDest)
    }

    public bitcrush = async (factor: number, filepath: string, fileDest: string) => {
        return this.processEffect(`gain -50 downsample ${factor} gain -n`, filepath, fileDest)
    }

    public distortion = async (gain: number, color: number, filepath: string, fileDest: string) => {
        return this.processEffect(`gain -50 overdrive ${gain} ${color} gain -n`, filepath, fileDest)
    }

    public chorus = async (delay: number, decay: number, speed: number, depth: number, filepath: string, fileDest: string) => {
        return this.processEffect(`gain -50 chorus 0.9 0.8 ${delay} ${decay} ${speed} ${depth} -t gain -n`, filepath, fileDest)
    }

    public phaser = async (delay: number, decay: number, speed: number, filepath: string, fileDest: string) => {
        return this.processEffect(`gain -50 phaser 0.9 0.8 ${delay} ${decay} ${speed} -t gain -n`, filepath, fileDest)
    }

    public flanger = async (delay: number, depth: number, regen: number, width: number, speed: number, shape: "sin" | "tri", phase: number, interp: "lin" | "quad", filepath: string, fileDest: string) => {
        return this.processEffect(`gain -50 flanger ${delay} ${depth} ${regen} ${width} ${speed} ${shape} ${phase} ${interp} gain -n`, filepath, fileDest)
    }

    public delay = async (delaysDecays: number[], filepath: string, fileDest: string) => {
        return this.processEffect(`gain -50 echo 0.9 0.8 ${delaysDecays.join(" ")} gain -n`, filepath, fileDest)
    }

    public pitch = async (pitch: number, filepath: string, fileDest: string) => {
        const cents = pitch * 100
        return this.processEffect(`pitch ${cents}`, filepath, fileDest)
    }

    public speed = async (factor: number, pitch: boolean, filepath: string, fileDest: string) => {
        let effect = `gain -50 tempo ${factor} gain -n`
        if (pitch) effect = `gain -50 speed ${factor} gain -n`
        return this.processEffect(effect, filepath, fileDest)
    }

    public reverse = async (filepath: string, fileDest: string) => {
        return this.processEffect("reverse", filepath, fileDest)
    }

    public reverb = async (reverb: number, damping: number, room: number, stereo: number, preDelay: number, wetGain: number, reverse: boolean, filepath: string, fileDest: string) => {
        let effect = `gain -50 pad 0 3 reverb ${reverb} ${damping} ${room} ${stereo} ${preDelay} ${wetGain} gain -n`
        if (reverse) {
            effect = `"|sox ${filepath} -p reverse reverb -w ${reverb} ${damping} ${room} ${stereo} ${preDelay} ${wetGain} reverse`
        }
        return this.processEffect(effect, filepath, fileDest)
    }

    public allPass = async (freq: number, width: number, filepath: string, fileDest: string) => {
        return this.processEffect(`gain -50 allpass ${freq} ${width} gain -n`, filepath, fileDest)
    }

    public combFilter = async (delay: number, decay: number, filepath: string, wavDest?: string) => {
        this.init()
        const wavFile = await this.convertToFormat(filepath, "wav")
        const arraybuffer = fs.readFileSync(wavFile, null).buffer
        const array = new Uint8Array(arraybuffer)
        const header = array.slice(0, 44)
        const samples = array.slice(44)
        const {sampleRate} = this.getWavInfo(header)
        const delayedSamples = Math.floor(delay * (sampleRate/1000))
        const combSamples = samples.slice()
        for (let i = 0; i < samples.length - delayedSamples; i++) {
            combSamples[i + delayedSamples] += combSamples[i] * decay
        }
        /*for (let i = 0; i < samples.length; i++) {
            combSamples[i] = (combSamples[i] + (decay*combSamples[i-delay]))
        }*/
        if (!wavDest) return combSamples
        const combArray = [...header, ...combSamples]
        console.log(combArray)
        fs.writeFileSync(wavDest, Buffer.from(new Uint8Array(combArray)))
        // const mp3File = await this.WavToMp3(wavDest)
        fs.unlink(wavFile, (err) => console.log(err))
        // fs.unlink(wavDest, (err) => console.log(err))
        return wavDest
    }

    public streamOgg = async (filepath: string) => {
        this.init()
        const ext = path.extname(filepath).replace(".", "")
        if (ext === "ogg") return fs.createReadStream(filepath)
        const filename = ext.length === 4 ? path.basename(filepath).slice(0, -5) : path.basename(filepath).slice(0, -4)
        const newDest = `./tracks/transform/${filename}.ogg`
        await new Promise((resolve) => {
            ffmpeg(filepath).toFormat("ogg").outputOptions(["-c:a", "libopus", "-b:a", "96k"]).save(newDest)
            .on("end", () => resolve())
        })
        return fs.createReadStream(newDest)
    }

    public pcmToWav = async (filepath: string) => {
        this.init()
        const ext = path.extname(filepath).replace(".", "")
        const filename = ext.length === 4 ? path.basename(filepath).slice(0, -5) : path.basename(filepath).slice(0, -4)
        const newDest = `./tracks/transform/${filename}.wav`
        await new Promise((resolve, reject) => {
            ffmpeg(filepath).inputOptions(["-f", "s16le", "-ar", "44.1k", "-ac", "2"]).save(newDest)
            .on("end", () => resolve())
            .on("error", () => reject())
        })
        return newDest
    }

    public convertToFormat = async (filepath: string, format: string) => {
        this.init()
        if (filepath.slice(-3) === "pcm") {
            const wavDest = await this.pcmToWav(filepath)
            return this.convertToFormat(wavDest, format)
        }
        const ext = path.extname(filepath).replace(".", "")
        const filename = ext.length === 4 ? path.basename(filepath).slice(0, -5) : path.basename(filepath).slice(0, -4)
        const newDest = `./tracks/transform/${filename}.${format}`
        await new Promise((resolve, reject) => {
            ffmpeg(filepath).toFormat(format).outputOptions("-bitexact").save(newDest)
            .on("end", () => resolve())
            .on("error", () => reject())
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
        const wavFile = await this.convertToFormat(filepath, "wav")
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
        const mp3File = await this.convertToFormat(wavDest, "mp3")
        fs.unlink(wavFile, (err) => console.log(err))
        fs.unlink(wavDest, (err) => console.log(err))
        return mp3File
    }
}
