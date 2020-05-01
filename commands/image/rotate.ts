import {Message, MessageAttachment} from "discord.js"
import jimp from "jimp"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Rotate extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Rotates an image a certain number of degrees.",
          help:
          `
          \`rotate degrees\` - Rotates the last posted image
          \`rotate degrees url\` - Rotates the linked image
          `,
          examples:
          `
          \`=>rotate 90\`
          `,
          aliases: [],
          cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        let url: string | undefined
        let degrees = Number(args[1])
        if (degrees < 0) {
            degrees = Math.abs(degrees)
        } else {
            degrees = -degrees
        }
        if (args[2]) {
            url = args[2]
        } else {
            url = await discord.fetchLastAttachment(message)
        }
        if (!url) return message.reply(`Could not find an image ${discord.getEmoji("kannaCurious")}`)
        const image = await jimp.read(url)
        image.rotate(degrees)
        image.autocrop()
        const buffer = await image.getBufferAsync(jimp.MIME_PNG)
        const attachment = new MessageAttachment(buffer)
        await message.reply(`Rotated the image **${Number(args[1])}** degrees!`, attachment)
        return
    }
}
