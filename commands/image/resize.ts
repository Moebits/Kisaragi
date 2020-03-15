import {Message, MessageAttachment} from "discord.js"
import jimp from "jimp"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Rotate extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Resizes an image to a new width/height (or scales proportionally).",
          help:
          `
          _Note: If you use scale, pass in a factor and not pixels. If you omit the height, resize is done proportionally._
          \`resize width height?\` - Resizes the last posted image
          \`resize width height? url\` - Resizes the linked image
          \`scale factor url?\` - Scales the image proportionally by factor.
          `,
          examples:
          `
          \`=>resize 1280 720\`
          \`=>resize 1920\`
          \`=>scale 1.5\`
          `,
          aliases: ["scale"],
          cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        let url: string | undefined
        let image: any
        if (args[0] === "scale") {
            if (args[2]) {
                url = args[2]
            } else {
                url = await discord.fetchLastAttachment(message)
            }
            if (!url) return message.reply(`Could not find an image ${discord.getEmoji("kannaCurious")}`)
            image = await jimp.read(url)
            const factor = Number(args[1]) ? Number(args[1]) : 1
            image.scale(factor)
        } else {
            let height = 0
            let width = 0
            if (Number(args[1]) && Number(args[2]) && args[3]) {
                width = Number(args[1])
                height = Number(args[2])
                url = args[3]
            } else if (Number(args[1]) && Number(args[2]) && !args[3]) {
                width = Number(args[1])
                height = Number(args[2])
            } else if (Number(args[1]) && args[2]) {
                width = Number(args[1])
                url = args[2]
            } else if (args[1]) {
                url = args[1]
            }
            if (!url) url = await discord.fetchLastAttachment(message)
            if (!url) return message.reply(`Could not find an image ${discord.getEmoji("kannaCurious")}`)
            image = await jimp.read(url)
            if (!width) width = jimp.AUTO
            if (!height) height = jimp.AUTO
            image.resize(width, height)
        }
        const buffer = await image.getBufferAsync(jimp.MIME_PNG)
        const attachment = new MessageAttachment(buffer)
        await message.reply(`Resized the image!`, attachment)
        return
    }
}
