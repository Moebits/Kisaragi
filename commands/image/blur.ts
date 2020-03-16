import {Message, MessageAttachment} from "discord.js"
import gm from "gm"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Blur extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Applies a gaussian blur to an image.",
          help:
          `
          \`blur radius\` - Blurs the last posted image
          \`blur radius url\` - Blurs the linked image
          `,
          examples:
          `
          \`=>blur 30\`
          `,
          aliases: ["gaussian"],
          cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        let url: string | undefined
        let factor = Number(args[1])
        if (args[2]) {
            url = args[2]
        } else {
            url = await discord.fetchLastAttachment(message)
        }
        if (!url) return message.reply(`Could not find an image ${discord.getEmoji("kannaCurious")}`)
        if (!factor) factor = 30
        if (factor < 0.3) factor = 0.3
        if (factor > 1000) factor = 1000
        console.log(url)
        const image = gm(url)
        image.blur(factor)
        let buffer: Buffer
        await new Promise((resolve) => {
            image.toBuffer((err, buf) => {
                buffer = buf
                resolve()
            })
        })
        console.log(buffer!)
        const attachment = new MessageAttachment(buffer!)
        await message.reply(`Blurred the image by a factor of **${factor}**!`, attachment)
        return
    }
}
