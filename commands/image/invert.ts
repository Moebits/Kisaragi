import {Message, AttachmentBuilder} from "discord.js"
import jimp from "jimp"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Invert extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Inverts the colors of an image.",
          help:
          `
          \`invert\` - Inverts the colors
          `,
          examples:
          `
          \`=>invert\`
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
        if (args[2]) {
            url = args[2]
        } else {
            url = await discord.fetchLastAttachment(message)
        }
        if (!url) return message.reply(`Could not find an image ${discord.getEmoji("kannaCurious")}`)
        const image = await jimp.read(url)
        image.invert()
        const buffer = await image.getBufferAsync(jimp.MIME_PNG)
        const attachment = new AttachmentBuilder(buffer)
        await message.reply({content: `Inverted the colors!`, files: [attachment]})
        return
    }
}
