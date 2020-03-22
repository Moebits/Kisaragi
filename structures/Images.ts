import axios from "axios"
import * as Canvas from "canvas"
import {v2 as cloudinary} from "cloudinary"
import concat from "concat-stream"
import {DMChannel, GuildMember, Message, MessageAttachment, TextChannel} from "discord.js"
import FormData from "form-data"
import fs from "fs"
import gifFrames from "gif-frames"
import sizeOf from "image-size"
import imagemin from "imagemin"
import imageminGifsicle from "imagemin-gifsicle"
import path from "path"
import request from "request"
import stream from "stream"
import unzip from "unzip"
import * as config from "../config.json"
import {Functions} from "./Functions"
import {Kisaragi} from "./Kisaragi.js"

const compressImages = require("compress-images")
const getPixels = require("get-pixels")
const GifEncoder = require("gif-encoder")
const imageDataURI = require("image-data-uri")

export class Images {
    // let blacklist = require("../blacklist.json");
    private readonly headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}
    constructor(private readonly discord: Kisaragi, private readonly message: Message) {}

    /** Compresses a gif. */
    public compressGif = async (input: string[]) => {
        const file = await imagemin(input,
        {destination: path.join(__dirname, "../../assets/images/gifs"),
         plugins: [imageminGifsicle({interlaced: false, optimizationLevel: 2, colors: 512})]
        })
        return file
    }

    /** Encodes a new gif. */
    public encodeGif = async (images: string[], folder: string, file: string | stream.Writable) => {
        return new Promise((resolve) => {
        const dimensions = sizeOf(`${folder}${path.basename(images[0])}`)
        const gif = new GifEncoder(dimensions.width, dimensions.height)
        gif.pipe(file)
        gif.setQuality(20)
        gif.setDelay(0)
        gif.setRepeat(0)
        gif.writeHeader()
        let counter = 0
        const addToGif = (frames: string[]) => {
            getPixels(`${folder}${path.basename(frames[counter])}`, function(err: Error, pixels: any) {
                gif.addFrame(pixels.data)
                gif.read()
                if (counter >= frames.length - 1) {
                    gif.finish()
                } else {
                    counter++
                    addToGif(images)
                }
            })
        }
        addToGif(images)
        gif.on("end", () => {
                resolve()
            })
        })
    }

    /** Compresses images and gifs. */
    public compressImages = (src: string, dest: string) => {
        return new Promise((resolve) => {
            const imgInput = src
            const imgOutput = dest
            compressImages(imgInput, imgOutput, {compress_force: true, statistic: false, autoupdate: true}, false,
            {jpg: {engine: "mozjpeg", command: ["-quality", "10"]}},
            {png: {engine: "pngquant", command: ["--quality=20-50"]}},
            {svg: {engine: "svgo", command: "--multipass"}},
            {gif: {engine: "gifsicle", command: ["--colors", "64", "--use-col=web"]}}, function(error: Error, completed: boolean) {
                if (completed === true) {
                    resolve()
                }
            })
        })
    }

    /** Downloads and extracts a zip file. */
    public downloadZip = async (url: string, path: string) => {
        return new Promise((resolve) => {
            const writeStream = request({url, headers: this.headers}).pipe(unzip.Extract({path}))
            writeStream.on("finish", () => {
                resolve()
            })
        })
    }

    /** Download any binary data (gif, video, etc.) */
    public download = async (url: string, dest: string) => {
        const bin = await axios.get(url, {responseType: "arraybuffer", headers: this.headers}).then((r) => r.data)
        fs.writeFileSync((dest), Buffer.from(bin, "binary"))
        return
    }

    /** Download image */
    public downloadImage = async (url: string, dest: string) => {
        if (dest.endsWith(".gif")) return this.download(url, dest)
        const writeStream = fs.createWriteStream(dest)
        await axios.get(url, {responseType: "stream", headers: this.headers}).then((r) => r.data.pipe(writeStream))
        return new Promise((resolve, reject) => {
            writeStream.on("finish", resolve)
            writeStream.on("error", reject)
        })
    }

    /** Download images */
    public downloadImages = async (images: string[], dest: string) => {
        await Promise.all(images.map(async (url, i) => {
            let name = path.basename(images[i])
            name = name.length > 15 ? name.slice(0, 15) : name
            try {
                await this.downloadImage(images[i], dest + name)
            } catch (e) {
                // console.log(e)
            }
        }))
    }

    /** Parse Imgur Album */
    public parseImgurAlbum = async (albumID: string, max?: number) => {
        const imgur = require("imgur")
        await imgur.setClientId(process.env.IMGUR_discord_ID)
        await imgur.setAPIUrl("https://api.imgur.com/3/")
        const album = await imgur.getAlbumInfo(albumID)
        let images = album.data.images.map((i: any) => i.link)
        images = Functions.shuffleArray(images)
        if (max) {
            return images.slice(0, max)
        } else {
            return images
        }
    }

    /** Fetch channel attachments */
    public fetchChannelAttachments = async (channel: TextChannel | DMChannel, limit?: number, gif?: boolean, messageID?: string) => {
        if (!limit) limit = Infinity
        let last = messageID || channel.lastMessageID
        let attachments: string[] = []
        let counter = 0
        const amount = limit < 100 ? limit : 100
        while (counter < limit) {
                const messages = await channel.messages.fetch({limit: amount, before: last!})
                last = messages.lastKey()!
                if (!last) break
                const aArray = messages.map((msg) => msg.attachments.map((a) => a.url))
                const eArray = messages.map((msg: Message) => msg.embeds.map(((e) => e.image?.url)))
                const filteredArray = [...aArray, ...eArray].flat(Infinity)
                for (let i = 0; i < filteredArray.length; i++) {
                    if (filteredArray[i]) {
                        const url = filteredArray[i].match(/.(png|jpg|gif)/) ? filteredArray[i] : filteredArray[i] + ".png"
                        attachments.push(url)
                    }
                }
                counter += 100
                await Functions.timeout(100)
        }
        attachments = attachments.filter((a) => {
            if (a.endsWith(".jpg") || a.endsWith(".png")) {
                return true
            } else if (a.endsWith(".gif")) {
                if (gif) {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        })
        return {attachments, last}
    }

    public colorStops = [
        "#FF8AD8",
        "#FF8ABB",
        "#F9FF8A",
        "#8AFFB3",
        "#8AE4FF",
        "#FF8AD8"
    ]

    /** Creates a welcome/leave canvas */
    public createCanvas = async (member: GuildMember, image: string, text: string, color: string, uri?: boolean, iterator?: number) => {
        const colorStops = this.colorStops
        const newText = text.replace(/user/g, `@${member.user.tag}`).replace(/guild/g, member.guild.name)
        .replace(/tag/g, member.user.tag).replace(/name/g, member.displayName).replace(/count/g, String(member.guild.memberCount))

        function wrapText(context: CanvasRenderingContext2D, txt: string, x: number, y: number, maxWidth: number, lineHeight: number) {
            const cars = txt.split("\n")
            for (let i = 0; i < cars.length; i++) {
                let line = ""
                const words = cars[i].split(" ")
                for (let n = 0; n < words.length; n++) {
                    const testLine = line + words[n] + " "
                    const metrics = context.measureText(testLine)
                    const testWidth = metrics.width
                    if (testWidth > maxWidth) {
                        context.strokeText(line, x, y)
                        context.fillText(line, x, y)
                        line = words[n] + " "
                        y += lineHeight
                    } else {
                        line = testLine
                    }
                }
                context.strokeText(line, x, y)
                context.fillText(line, x, y)
                y += lineHeight
            }
        }

        function applyText(cv: Canvas.Canvas, txt: string) {
            const context = cv.getContext("2d")
            let fontSize = 70
            do {
                context.font = `${fontSize -= 1}px 07nikumarufont`
            } while (context.measureText(txt).width > (cv.width*2.2) - 300)
            return context.font
        }

        const canvas = Canvas.createCanvas(700, 250)
        const ctx = canvas.getContext("2d")

        let background: Canvas.Image
        if (image.includes("gif")) {
            const random  = Math.floor(Math.random() * 1000000)
            const dir = path.join(__dirname, `../../../assets/images/dump/${random}/`)
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive: true})

            const files: string[] = []
            const attachmentArray: string[] = []
            let frames = await gifFrames({url: image, frames: "all", cumulative: true})
            frames = Functions.constrain(frames, 50)

            for (let i = 0; i < frames.length; i++) {
                const readStream = frames[i].getImage()
                const writeStream = fs.createWriteStream(path.join(dir, `./image${frames[i].frameIndex}.jpg`))
                await new Promise((resolve) => {
                    readStream.pipe(writeStream).on("finish", () => resolve())
                })
                files.push(path.join(dir, `./image${frames[i].frameIndex}.jpg`))
            }
            let rIterator = 0
            const msg2 = await this.message.channel.send(`**Encoding Gif. This might take awhile** ${this.discord.getEmoji("gabCircle")}`) as Message
            for (let i = 0; i < 6; i++) {
                if (rIterator === this.colorStops.length - 1) {
                    rIterator = 0
                }
                const dataURI = await this.createCanvas(member, files[i], text, color, true, rIterator)
                await imageDataURI.outputFile(dataURI, path.join(dir, `./image${i}`))
                attachmentArray.push(`image${i}.jpeg`)
                rIterator++
            }
            const file = fs.createWriteStream(path.join(dir, `./animated${random}.gif`))
            await this.encodeGif(attachmentArray, dir, file)
            msg2.delete()
            const attachment = new MessageAttachment(path.join(dir, `./animated${random}.gif`), "animated.gif")
            return attachment

        } else {
            background = await Canvas.loadImage(image)
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
            ctx.font = applyText(canvas, newText)
            ctx.strokeStyle= "black"
            ctx.lineWidth = 4
            if (color === "rainbow") {
                let rainbowIterator = iterator ? iterator : 0
                const gradient = ctx.createLinearGradient(0, 0, canvas.width + 200, 0)
                for (let i = 0; i < colorStops.length; i++) {
                    let currColor = colorStops[rainbowIterator + i]
                    const position = (1/colorStops.length)*i
                    if (currColor === colorStops[colorStops.length]) {
                        currColor = colorStops[0]
                        rainbowIterator = 0
                    }
                    gradient.addColorStop(position, currColor)
                }
                ctx.fillStyle = gradient
            } else {
                ctx.fillStyle = color
            }
            wrapText(ctx, newText, canvas.width / 2.8, canvas.height / 4, 450, 55)

            ctx.beginPath()
            ctx.arc(125, 125, 100, 0, Math.PI * 2, true)
            ctx.closePath()
            ctx.clip()

            const avatar = await Canvas.loadImage(member.user.displayAvatarURL({format: "png"}))
            ctx.drawImage(avatar, 25, 25, 200, 200)

            if (uri) {
                return canvas.toDataURL("image/jpeg")
            }

            const attachment = new MessageAttachment(canvas.toBuffer(), `welcome.jpg`)
            return attachment
        }
    }

    /** Uploads to file.io */
    public fileIOUpload = async (file: string) => {
        const fd = new FormData()
        let res: any
        await new Promise((resolve) => {
            fd.append("file", fs.createReadStream(file))
            fd.pipe(concat({encoding: "buffer"}, async (data: any) => {
                const result = await axios.post("https://file.io/?expires=1w", data, {headers: fd.getHeaders(), maxContentLength: Infinity}).then((r: any) => r.data)
                res = result.link
                resolve()
            }))
        })
        return res
    }

    /** Uploads to cloudinary */
    public cloudUpload = async (file: string, folder: string) => {
        cloudinary.config({
            cloud_name: "kisaragi" ,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        })
        const link = await cloudinary.uploader.upload(file, {folder})
        return {link: link.url, publicID: link.public_id}
    }

    /** Deletes files from cloudinary in a queue */
    public cloudDelete = async (publicIDs: string[]) => {
        cloudinary.config({
            cloud_name: "kisaragi" ,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        })
        if (publicIDs.length > 20) {
            const deletionQueue: string[] = []
            do {
                const popped = publicIDs.shift()
                if (!popped) break
                deletionQueue.push(popped)
            } while (publicIDs.length > 10)
            await cloudinary.api.delete_resources(deletionQueue)
        }
    }

    /** Deletes local files in a queue */
    public queuedDelete = async (files: string[]) => {
        if (files.length > 20) {
            const deletionQueue: string[] = []
            do {
                const popped = files.shift()
                if (!popped) break
                deletionQueue.push(popped)
            } while (files.length > 10)
            const promiseArray: any[] = []
            for (let i = 0; i < deletionQueue.length; i++) {
                const promise = new Promise((resolve)=> {
                    fs.unlink(deletionQueue[i], () => resolve())
                })
                promiseArray.push(promise)
            }
            await Promise.all(promiseArray)
            return deletionQueue.length
        }
        return 0
    }

    /** Uploads files to my api */
    public upload = async (files: string[]) => {
        const links: string[] = []
        const url = `${config.imagesAPI}/upload`
        for (let i = 0; i < files.length; i++) {
            if (files[i].includes("http")) {
                const result = await axios.post(url, {images: files[i]}).then((r: any) => r.data)
                links.push(result)
            } else {
                const fd = new FormData()
                await new Promise((resolve) => {
                    fd.append("images", fs.createReadStream(files[i]))
                    fd.pipe(concat({encoding: "buffer"}, async (data: any) => {
                        const result = await axios.post(url, data, {headers: fd.getHeaders(), maxContentLength: Infinity}).then((r: any) => r.data)
                        links.push(result)
                        resolve()
                    }))
                })
            }
        }
        return links.flat(Infinity)
    }
}
