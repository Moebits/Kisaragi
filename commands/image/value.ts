import {Message, AttachmentBuilder} from "discord.js"
import jimp from "jimp"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Value extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Lightens or darkens an image (mixes with white/black).",
          help:
          `
          _Note: Use positive values for lightness, negative for darkness._
          \`value amount\` - Changes the value of the last posted image
          \`value amount url\` - Changes the value of the linked image
          `,
          examples:
          `
          \`=>value 50\`
          \`=>value -25\`
          `,
          aliases: ["lighten", "darken", "lightness", "darkness"],
          cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        let url: string | undefined
        let value = Number(args[1])
        let setDarkness = false
        if (value < 0) {
            setDarkness = true
            value = Math.abs(value)
        }
        if (args[2]) {
            url = args[2]
        } else {
            url = await discord.fetchLastAttachment(message)
        }
        if (!url) return message.reply(`Could not find an image ${discord.getEmoji("kannaCurious")}`)
        const image = await jimp.read(url)
        if (setDarkness) {
            // @ts-ignore
            image.color([{apply: "darken", params: [value]}])
        } else {
            // @ts-ignore
            image.color([{apply: "lighten", params: [value]}])
        }
        const buffer = await image.getBufferAsync(jimp.MIME_PNG)
        const attachment = new AttachmentBuilder(buffer)
        await message.reply({content: `Changed the value of the image!`, files: [attachment]})
        return
    }
}
