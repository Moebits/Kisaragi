import {Message, MessageAttachment} from "discord.js"
import sharp from "sharp"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Tint extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Tints the image with a color.",
          help:
          `
          \`tint #hexcolor\` - Tints the last posted image
          \`tint #hexcolor url\` - Tints the linked image
          `,
          examples:
          `
          \`=>tint #ff5ce1 60\`
          `,
          aliases: ["colorize", "photofilter"],
          cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        let url: string | undefined
        const color = args[1]
        if (args[2]) {
            url = args[2]
        } else {
            url = await discord.fetchLastAttachment(message)
        }
        if (!url) return message.reply(`Could not find an image ${discord.getEmoji("kannaCurious")}`)
        const image = sharp(url)
        image.tint(color)
        const buffer = await image.toBuffer()
        const attachment = new MessageAttachment(buffer)
        await message.reply(`Tinted the image with the color **${color}**!`, attachment)
        return
    }
}
