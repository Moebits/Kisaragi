import {Message, AttachmentBuilder} from "discord.js"
import jimp from "jimp"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Contrast extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Increases or decreases the contrast of an image.",
          help:
          `
          _Note: The range is -100 to 100._
          \`contrast factor\` - Edits the contrast of the last posted image
          \`contrast factor url\` - Edits the contrast of the linked image
          `,
          examples:
          `
          \`=>contrast 40\`
          `,
          aliases: ["contrast"],
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
        factor /= 100
        if (factor < -1) factor = -1
        if (factor > 1) factor = 1
        const image = await jimp.read(url)
        image.contrast(factor)
        const buffer = await image.getBufferAsync(jimp.MIME_PNG)
        const attachment = new AttachmentBuilder(buffer)
        await message.reply({content:`Shifted the contrast by a factor of **${factor*100}**!`, files: [attachment]})
        return
    }
}
