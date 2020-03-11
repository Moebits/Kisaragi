import {Message} from "discord.js"
import ffmpeg from "fluent-ffmpeg"
import fs from "fs"
import path from "path"
import {Functions} from "./Functions"
import {Kisaragi} from "./Kisaragi"

export class AudioEffects {
    constructor(private readonly discord: Kisaragi, private readonly message: Message) {}

    public init = (remove?: boolean) => {
        if (remove) Functions.removeDirectory(`./tracks/transform`)
        if (!fs.existsSync(`./tracks/transform`)) fs.mkdirSync(`./tracks/transform`, {recursive: true})
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

    public reverse = async (filepath: string, wavDest: string) => {
        this.init()
        const wavFile = await this.mp3ToWav(filepath)
        const arraybuffer = fs.readFileSync(wavFile, null).buffer
        const array = new Uint8Array(arraybuffer)
        const header = array.slice(0, 44)
        const samples = array.slice(44)
        const byteDepth = this.getByteDepth(header)
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

    public getByteDepth = (header: Uint8Array) => {
        let littleEndian = false
        let bitDepth = 0
        let topCode = ""
        for (let i = 0; i < 4; i++) {
            topCode += String.fromCharCode(header[i])
        }
        if (topCode === "RIFF") {
            littleEndian = true
        }
        if (littleEndian) {
            bitDepth = Number(`${header[35]}${header[34]}`)
        } else {
            bitDepth = Number(`${header[34]}${header[35]}`)
        }
        const byteDepth = (bitDepth) / 8
        return byteDepth
    }

    public combFilter(filepath: string, wavDest: string) {
        //
    }
}
