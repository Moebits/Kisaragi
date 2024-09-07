import {Message, AttachmentBuilder} from "discord.js"
import {SlashCommandOption} from "../../structures/SlashCommandOption"
import jimp from "jimp"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Kisaragi} from "../../structures/Kisaragi"

export default class Saturation extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
          description: "Increases or decreases the saturation of an image.",
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
          aliases: ["saturate", "desaturate"],
          cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        let url: string | undefined
        let value = Number(args[1])
        let setDesaturate = false
        if (value < 0) {
            setDesaturate = true
            value = Math.abs(value)
        }
        if (args[2]) {
            url = args[2]
        } else {
            url = await discord.fetchLastAttachment(message)
        }
        if (!url) return message.reply(`Could not find an image ${discord.getEmoji("kannaCurious")}`)
        const image = await jimp.read(url)
        if (setDesaturate) {
            // @ts-ignore
            image.color([{apply: "desaturate", params: [value]}])
        } else {
            // @ts-ignore
            image.color([{apply: "saturate", params: [value]}])
        }
        const buffer = await image.getBufferAsync(jimp.MIME_PNG)
        const attachment = new AttachmentBuilder(buffer)
        await message.reply({content: `Changed the saturation of the image!`, files: [attachment]})
        return
    }
}
