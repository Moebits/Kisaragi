import {Message, MessageAttachment} from "discord.js"
import sharp from "sharp"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Sharpen extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Sharpens an image.",
          help:
          `
          \`sharpen factor\` - Sharpens the last posted image
          \`sharpen factor url\` - Sharpens the linked image
          `,
          examples:
          `
          \`=>sharpen 50\`
          `,
          aliases: ["sharp"],
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
        const image = sharp(url)
        image.sharpen(factor)
        const buffer = await image.toBuffer()
        const attachment = new MessageAttachment(buffer)
        await message.reply(`Sharpened the image by a factor of **${factor}**!`, attachment)
        return
    }
}
