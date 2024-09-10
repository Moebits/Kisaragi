import {Message, AttachmentBuilder} from "discord.js"
import {SlashCommandSubcommand, SlashCommandOption} from "../../structures/SlashCommandOption"
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
          \`saturation amount\` - Changes the saturation of the last posted image
          \`saturation amount url\` - Changes the saturation of the linked image
          `,
          examples:
          `
          \`=>saturation 50\`
          \`=>saturation -25\`
          `,
          aliases: ["saturate", "desaturate"],
          cooldown: 10,
          defer: true,
          subcommandEnabled: true
        })
        const urlOption = new SlashCommandOption()
            .setType("string")
            .setName("url")
            .setDescription("Url, or use the last posted image.")

        const factorOption = new SlashCommandOption()
            .setType("integer")
            .setName("factor")
            .setDescription("Saturation factor.")
            .setRequired(true)

        this.subcommand = new SlashCommandSubcommand()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addOption(factorOption)
            .addOption(urlOption)
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
        if (!url) return this.reply(`Could not find an image ${discord.getEmoji("kannaCurious")}`)
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
        return this.reply(`Changed the saturation of the image!`, attachment)
    }
}
