import {Message, MessageAttachment} from "discord.js"
import fs from "fs"
import gifFrames from "gif-frames"
import path from "path"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Images} from "./../../structures/Images"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class ConstrainGIF extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Compresses a gif to be under a certain amount of frames.",
            help:
            `
            \`constraingif frames\` - Constrains the last posted gif.
            \`constraingif frames url\` - Constrains the linked gif.
            `,
            examples:
            `
            \`=>constraingif 20\`
            `,
            aliases: ["cgif", "compressgif"],
            cooldown: 20
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const images = new Images(discord, message)
        const regex = new RegExp(/.gif/)
        const constrain = Number(args[1]) ? Number(args[1]) : 20
        let url: string | undefined
        if (args[2]) {
            url = args[2]
        } else {
            url = await discord.fetchLastAttachment(message, false, regex)
        }
        if (!url) return message.reply(`Could not find a gif ${discord.getEmoji("kannaCurious")}`)
        const frames = await gifFrames({url, frames: "all", cumulative: true})
        if (constrain >= frames.length) return message.reply(`It looks like the gif doesn't even have this many frames ${discord.getEmoji("kannaCurious")}`)
        const newFrames = Functions.constrain(frames, constrain) as any[]
        const random = Math.floor(Math.random() * 10000)
        const dir = path.join(__dirname, `../../../assets/images/dump/${random}/`)
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive: true})
        const files: string[] = []
        const promises: any[] = []
        for (let i = 0; i < newFrames.length; i++) {
            const readStream = newFrames[i].getImage()
            const writeStream = fs.createWriteStream(path.join(dir, `./image${newFrames[i].frameIndex}.jpg`))
            const prom = new Promise((resolve) => {
                readStream.pipe(writeStream).on("finish", () => resolve())
            })
            files.push(path.join(dir, `./image${newFrames[i].frameIndex}.jpg`))
            promises.push(prom)
        }
        await Promise.all(promises)
        const msg = await this.message.channel.send(`**Encoding Gif. This might take awhile...** ${this.discord.getEmoji("gabCircle")}`)
        const file = fs.createWriteStream(path.join(dir, `./animated.gif`))
        await images.encodeGif(files, dir, file)
        msg.delete()
        const attachment = new MessageAttachment(path.join(dir, `./animated.gif`), "animated.gif")
        return message.reply(`Constrained a **${frames.length}** frame gif down to **${files.length}** frames!`, attachment)
    }
}
