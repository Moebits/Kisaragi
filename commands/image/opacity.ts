import {Message, AttachmentBuilder} from "discord.js"
import jimp from "jimp"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Opacity extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Changes the opacity of an image.",
          help:
          `
          _Note: The range is 0 to 100._
          \`opacity factor\` - Edits the opacity of the last posted image
          \`opacity factor url\` - Edits the opacity of the linked image
          `,
          examples:
          `
          \`=>opacity 70\`
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
        let factor = Number(args[1])
        if (args[2]) {
            url = args[2]
        } else {
            url = await discord.fetchLastAttachment(message)
        }
        if (!url) return message.reply(`Could not find an image ${discord.getEmoji("kannaCurious")}`)
        if (!factor) factor = 100
        factor /= 100
        if (factor < 0) factor = 0
        if (factor > 1) factor = 1
        const image = await jimp.read(url)
        image.opacity(factor)
        const buffer = await image.getBufferAsync(jimp.MIME_PNG)
        const attachment = new AttachmentBuilder(buffer)
        await message.reply({content: `Changed the opacity to **${factor}**!`, files: [attachment]})
        return
    }
}
