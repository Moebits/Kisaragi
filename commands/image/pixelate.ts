import {Message, AttachmentBuilder} from "discord.js"
import jimp from "jimp"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Pixelate extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Adds a pixelation effect to an image.",
          help:
          `
          _Note: The range is -100 to 100._
          \`pixelate factor\` - Edits the pixelation of the last posted image
          \`pixelate factor url\` - Edits the pixelation of the linked image
          `,
          examples:
          `
          \`=>pixelate 50\`
          `,
          aliases: ["censor"],
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
        if (!factor) factor = 0
        const image = await jimp.read(url)
        image.pixelate(factor)
        const buffer = await image.getBufferAsync(jimp.MIME_PNG)
        const attachment = new AttachmentBuilder(buffer)
        await message.reply({content: `Pixelated the image by a factor of **${factor}**!`, files: [attachment]})
        return
    }
}
