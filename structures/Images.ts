import * as Canvas from "canvas"
import {GuildMember, Message, MessageAttachment, TextChannel} from "discord.js"
import * as fs from "fs"
import gifFrames from "gif-frames"
import sizeOf from "image-size"
import imagemin from "imagemin"
import imageminGifsicle from "imagemin-gifsicle"
import request from "request"
import stream from "stream"
import unzip from "unzip"
import {Functions} from "./Functions"
import {Kisaragi} from "./Kisaragi.js"

const compressImages = require("compress-images")
const getPixels = require("get-pixels")
const GifEncoder = require("gif-encoder")
const imageDataURI = require("image-data-uri")
const download = require("image-downloader")

export class Images {
    // let blacklist = require("../blacklist.json");

    constructor(private readonly discord: Kisaragi, private readonly message: Message) {}

    // Compress Gif
    public compressGif = async (input: string[]) => {
        const file = await imagemin(input,
        {destination: "../assets/gifs",
         plugins: [imageminGifsicle({interlaced: false, optimizationLevel: 2, colors: 512})]
        })
        return file
    }

    // Encode Gif
    public encodeGif = async (fileNames: string[], path: string, file: string | stream.Writable) => {
        const images: string[] = []
        if (fileNames.length > 500) {
            for (let i = 0; i < fileNames.length; i+=5) {
                images.push(fileNames[i])
            }
        } else if (fileNames.length > 300) {
            for (let i = 0; i < fileNames.length; i+=4) {
                images.push(fileNames[i])
            }
        } else if (fileNames.length > 80) {
            for (let i = 0; i < fileNames.length; i+=3) {
                images.push(fileNames[i])
            }
        } else if (fileNames.length > 40) {
            for (let i = 0; i < fileNames.length; i+=2) {
                images.push(fileNames[i])
            }
        } else {
            for (let i = 0; i < fileNames.length; i++) {
                images.push(fileNames[i])
            }
        }
        return new Promise((resolve) => {

        const dimensions = sizeOf(`${path}${images[0]}`)
        const gif = new GifEncoder(dimensions.width, dimensions.height)
        gif.pipe(file)
        gif.setQuality(20)
        gif.setDelay(0)
        gif.setRepeat(0)
        gif.writeHeader()
        let counter = 0

        const addToGif = (frames: string[]) => {
                getPixels(`${path}${frames[counter]}`, function(err: Error, pixels: any) {
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

    // Compress Images
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

    // Download Zip
    public downloadZip = async (url: string, path: string) => {
        return new Promise((resolve) => {
            const writeStream = request({url, headers: {Referer: "https://www.pixiv.net/"}}).pipe(unzip.Extract({path}))
            writeStream.on("finish", () => {
                resolve()
            })
        })
    }

    // Download Pages
    public downloadPages = async (array: string[], dest: string) => {
        await Promise.all(array.map(async (url, i) => {
            const options = {
                url,
                dest: `${dest}page${i}.jpg`
            }

            try {
                const {filename} = await download.image(options)
                console.log(filename)
            } catch (e) {
                console.log(e)
            }
        }))
    }

    // Fetch Channel Attachments
    public fetchChannelAttachments = async (channel: TextChannel) => {
        let beforeID = channel.lastMessageID
        const attachmentArray: string[] = []
        while (beforeID !== undefined || null) {
            setTimeout(async () => {
                const messages = await channel.messages.fetch({limit: 100, before: beforeID!})
                beforeID = messages.lastKey()!
                const filteredArray = messages.map((msg: Message) => msg.attachments.map((a: MessageAttachment) => a.url)).flat(1)
                for (let i = 0; i < filteredArray.length; i++) {
                    attachmentArray.push(filteredArray[i])
                }
            }, 120000)
        }
        return attachmentArray
    }

    public colorStops = [
        "#FF8AD8",
        "#FF8ABB",
        "#F9FF8A",
        "#8AFFB3",
        "#8AE4FF",
        "#FF8AD8"
    ]

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
        const random  = Math.floor(Math.random() * 1000000)
        if (image.includes("gif")) {
            if (!fs.existsSync(`../assets/images/${random}/`)) {
                fs.mkdirSync(`../assets/images/${random}/`)
            }

            const files: string[] = []
            const attachmentArray: string[] = []
            const frames = await gifFrames({url: image, frames: "all", cumulative: true})

            for (let i = 0; i < frames.length; i++) {
                const readStream = frames[i].getImage()
                const writeStream = fs.createWriteStream(`../assets/images/${random}/image${frames[i].frameIndex}.jpg`)
                await Functions.awaitPipe(readStream, writeStream)
                files.push(`../assets/images/${random}/image${frames[i].frameIndex}.jpg`)
            }

            await Functions.timeout(500)
            let rIterator = 0
            const msg2 = await this.message.channel.send(`**Encoding Gif. This might take awhile** ${this.discord.getEmoji("gabCircle")}`) as Message
            for (let i = 0; i < 6; i++) {
                if (rIterator === this.colorStops.length - 1) {
                    rIterator = 0
                }
                const dataURI = await this.createCanvas(member, files[i], text, color, true, rIterator)
                await imageDataURI.outputFile(dataURI, `../assets/images/${random}/image${i}`)
                attachmentArray.push(`image${i}.jpeg`)
                rIterator++
            }

            const file = fs.createWriteStream(`../assets/images/${random}/animated.gif`)
            await this.encodeGif(attachmentArray, `../assets/images/${random}/`, file)
            msg2.delete()
            const attachment = new MessageAttachment(`../assets/images/${random}/animated.gif`)
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

            const avatar = await Canvas.loadImage(member.user.displayAvatarURL())
            ctx.drawImage(avatar, 25, 25, 200, 200)

            if (uri) {
                return canvas.toDataURL("image/jpeg")
            }

            const attachment = new MessageAttachment(canvas.toBuffer(), `welcome.jpg`)
            return attachment
        }
    }
}
