import child_process from "child_process"
import {Message} from "discord.js"
import fs from "fs"
import path from "path"
import {FFmpeg} from "prism-media"
import {Functions} from "./Functions"
import {Kisaragi} from "./Kisaragi"

export class Video {
    constructor(private readonly discord: Kisaragi, private readonly message: Message) {}
    public init = (remove?: boolean) => {
        if (remove) Functions.removeDirectory(`./videos/transform`)
        if (!fs.existsSync(`./videos/transform`)) fs.mkdirSync(`./videos/transform`, {recursive: true})
    }

    public executeCommand = (command: string) => {
        const response = child_process.execSync(command.replace(/\\/g, "/"))
        return response.toString()
    }

    public getDir = () => {
        const dir = child_process.execSync("cd")
        return `${dir}/`
    }

    public createImgVideo = async (audioFile: string, imgFile?: string) => {
        let name = path.basename(audioFile).slice(0, -4)
        if (imgFile) name = path.basename(imgFile).slice(0, -4)
        if (!imgFile) imgFile = "../assets/images/default.jpg"
        this.init()
        const input = fs.createReadStream(audioFile)
        const input2 = fs.createReadStream(imgFile)
        const newDest = `./videos/${name}.mp4`
        const output = fs.createWriteStream(newDest)
        const ffmpeg = new FFmpeg({args: ["-i", imgFile, "-i", audioFile, "-c:v", "libx264", "-tune", "stillimage", "-c:a", "aac", "-b:a", "192k", "-shortest", newDest]})
        const stream = ffmpeg.pipe(output)
        console.log(stream)
        await Functions.awaitStream(input, output)
        return newDest
    }

    public reverseVideo = async (videoFile: string) => {
        const name = path.basename(videoFile).slice(0, -4)
        const newDest = `./videos/transform/${name}.mp4`
        this.init()
        const input = fs.createReadStream(videoFile)
        const output = fs.createWriteStream(newDest)
        const ffmpeg = new FFmpeg({args: ["-i", videoFile, "-map", "0", "-c:v", "copy", "-af", "areverse", newDest]})
        const stream = ffmpeg.pipe(output)
        console.log(stream)
        await Functions.awaitStream(input, output)
        return newDest
    }

    public extractAudio = async (videoFile: string, newDest?: string) => {
        const name = path.basename(videoFile).slice(0, -4)
        if (!newDest) newDest = `./tracks/transform/${name}.mp3`
        this.init()
        const input = fs.createReadStream(videoFile)
        const output = fs.createWriteStream(newDest)
        const ffmpeg = new FFmpeg({args: ["-i", videoFile, "-f", "mp3", "-ab", "192000", "-vn", newDest]})
        const stream = ffmpeg.pipe(output)
        console.log(stream)
        await Functions.awaitStream(input, output)
        return newDest
    }
}
