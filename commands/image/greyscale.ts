import {Message, MessageAttachment} from "discord.js"
import sharp from "sharp"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Greyscale extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Makes an image greyscale.",
          help:
          `
          \`greyscale\` - Makes the image greyscale
          `,
          examples:
          `
          \`=>greyscale\`
          `,
          aliases: ["grayscale"],
          cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        let url: string | undefined
        if (args[2]) {
            url = args[2]
        } else {
            url = await discord.fetchLastAttachment(message)
        }
        if (!url) return message.reply(`Could not find an image ${discord.getEmoji("kannaCurious")}`)
        const image = sharp(url)
        image.greyscale()
        const buffer = await image.toBuffer()
        const attachment = new MessageAttachment(buffer)
        await message.reply(`Made the image greyscale!`, attachment)
        return
    }
}
