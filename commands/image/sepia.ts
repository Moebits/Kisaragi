import {Message, AttachmentBuilder} from "discord.js"
import jimp from "jimp"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Sepia extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
          description: "Apply a sepia wash to an image.",
          help:
          `
          \`sepia url?\` - Apply a sepia
          `,
          examples:
          `
          \`=>sepia\`
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
        if (args[1]) {
            url = args[1]
        } else {
            url = await discord.fetchLastAttachment(message)
        }
        if (!url) return message.reply(`Could not find an image ${discord.getEmoji("kannaCurious")}`)
        const image = await jimp.read(url)
        image.sepia()
        const buffer = await image.getBufferAsync(jimp.MIME_PNG)
        const attachment = new AttachmentBuilder(buffer)
        await message.reply({content: `Applied a sepia effect!`, files: [attachment]})
        return
    }
}
