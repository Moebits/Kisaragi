import {Message, AttachmentBuilder} from "discord.js"
import {SlashCommandSubcommand, SlashCommandOption} from "../../structures/SlashCommandOption"
import jimp from "jimp"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Crop extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Crops an image at an x and y offset.",
          help:
          `
          _Note: Omit the height for a proportional crop._
          \`crop x y width height?\` - Crops the last posted image
          \`crop x y width height? url\` - Crops the linked image
          `,
          examples:
          `
          \`=>crop 100 200 200 200\`
          \`=>crop 200 300 1280\`
          `,
          aliases: [],
          cooldown: 10,
          defer: true,
          subcommandEnabled: true
        })
        const urlOption = new SlashCommandOption()
            .setType("string")
            .setName("url")
            .setDescription("Url, or use the last posted image.")

        const heightOption = new SlashCommandOption()
            .setType("integer")
            .setName("height")
            .setDescription("Height of crop.")

        const widthOption = new SlashCommandOption()
            .setType("integer")
            .setName("width")
            .setDescription("Width of crop.")
            .setRequired(true)

        const yOption = new SlashCommandOption()
            .setType("integer")
            .setName("y")
            .setDescription("Y-position of crop.")
            .setRequired(true)

        const xOption = new SlashCommandOption()
            .setType("integer")
            .setName("x")
            .setDescription("X-position of crop.")
            .setRequired(true)

        this.subcommand = new SlashCommandSubcommand()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addOption(xOption)
            .addOption(yOption)
            .addOption(widthOption)
            .addOption(heightOption)
            .addOption(urlOption)
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        let url: string | undefined
        const x = Number(args[1]) ? Number(args[1]) : 0
        const y = Number(args[2]) ? Number(args[2]) : 0
        if (args[5]) {
            url = args[5]
        } else if (args[4] && Number.isNaN(Number(args[4]))) {
            url = args[4]
        } else {
            url = await discord.fetchLastAttachment(message)
        }
        if (!url) return this.reply(`Could not find an image ${discord.getEmoji("kannaCurious")}`)
        const image = await jimp.read(url)
        let width = Number(args[3]) ? Number(args[3]) : image.bitmap.width
        let height = Number(args[4]) ? Number(args[4]) : Math.floor(image.bitmap.height / (image.bitmap.width / width * 1.0))
        if (width > image.bitmap.width) width = image.bitmap.width
        if (height > image.bitmap.height) height = image.bitmap.height
        image.crop(x, y, width, height)
        const buffer = await image.getBufferAsync(jimp.MIME_PNG)
        const attachment = new AttachmentBuilder(buffer)
        return this.reply(`Cropped the image to an offset of **${x}, ${y}** pixels, to a width of **${width}** pixels, and to a height of **${height}** pixels!`, attachment)
    }
}
