import {Message, AttachmentBuilder} from "discord.js"
import jimp from "jimp"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Kisaragi} from "../../structures/Kisaragi"

export default class Scale extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Scales an image by a certain factor.",
          help:
          `
          _Note: To resize by pixels instead, see \`resize\`._
          \`scale factor\` - Scales the last posted image
          \`scale factor url\` - Scales the linked image
          `,
          examples:
          `
          \`=>scale 1.5\`
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
        let image: any
        if (args[2]) {
            url = args[2]
        } else {
            url = await discord.fetchLastAttachment(message)
        }
        if (!url) return message.reply(`Could not find an image ${discord.getEmoji("kannaCurious")}`)
        image = await jimp.read(url)
        const factor = Number(args[1]) ? Number(args[1]) : 1
        image.scale(factor)
        const buffer = await image.getBufferAsync(jimp.MIME_PNG)
        const attachment = new AttachmentBuilder(buffer)
        await message.reply({content: `Scaled the image by a factor of **${factor}x**!`, files: [attachment]})
        return
    }
}
