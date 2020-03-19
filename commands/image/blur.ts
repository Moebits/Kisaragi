import {Message, MessageAttachment} from "discord.js"
import jimp from "jimp"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Blur extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Applies a fast or gaussian blur to an image.",
          help:
          `
          \`blur radius\` - Blurs the last posted image
          \`blur radius url\` - Blurs the linked image
          \`gaussian radius url?\` - Applies a gaussian blur instead of a fast blur.
          `,
          examples:
          `
          \`=>blur 30\`
          \`=>gaussian 40\`
          `,
          aliases: ["gaussian", "blurry", "blurriness"],
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
        if (!factor) factor = 10
        const image = await jimp.read(url)
        if (args[0] === "gaussian") {
            image.gaussian(factor)
        } else {
            image.blur(factor)
        }
        const buffer = await image.getBufferAsync(jimp.MIME_PNG)
        const attachment = new MessageAttachment(buffer!)
        await message.reply(`Blurred the image by a factor of **${factor}**!`, attachment)
        return
    }
}
