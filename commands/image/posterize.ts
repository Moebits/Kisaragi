import {Message, AttachmentBuilder} from "discord.js"
import jimp from "jimp"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Sepia extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Applies a posterization effect to an image.",
          help:
          `
          \`posterize level\` - Apples a posterization effect.
          `,
          examples:
          `
          \`=>posterize 10\`
          `,
          aliases: [],
          cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const level = Number(args[1]) ? Number(args[1]) : 10
        let url: string | undefined
        if (args[2]) {
            url = args[2]
        } else {
            url = await discord.fetchLastAttachment(message)
        }
        if (!url) return message.reply(`Could not find an image ${discord.getEmoji("kannaCurious")}`)
        const image = await jimp.read(url)
        image.posterize(level)
        const buffer = await image.getBufferAsync(jimp.MIME_PNG)
        const attachment = new AttachmentBuilder(buffer)
        await message.reply({content: `Applied a posterization effect!`, files: [attachment]})
        return
    }
}
