import axios from "axios"
import {Message, AttachmentBuilder} from "discord.js"
import config from "../../config.json"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import jimp from "jimp"
import {sharpen} from "animedetect"

export default class Sharpen extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
          description: "Sharpens an image.",
          help:
          `
          \`sharpen amount? sigma?\` - Sharpens the last posted image
          \`sharpen amount? sigma? url\` - Sharpens the linked image
          `,
          examples:
          `
          \`=>sharpen 5\`
          `,
          aliases: ["sharp", "sharpness"],
          cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        let amount = 1
        let sigma = 1
        let url: string | undefined
        if (args[3]) {
            url = args[3]
        } else if (Number(args[2])) {
            sigma = Number(args[2])
        } else if (args[2]) {
            url = args[2]
        } else if (Number(args[1])) {
            amount = Number(args[1])
        } else if (args[1]) {
            url = args[1]
        }
        if (!url) url = await discord.fetchLastAttachment(message)
        if (!url) return message.reply(`Could not find an image ${discord.getEmoji("kannaCurious")}`)
        const sharpened = await sharpen(url, {amount, sigma})
        const buffer = await sharpened.getBufferAsync(jimp.MIME_PNG)
        const attachment = new AttachmentBuilder(buffer)
        await message.reply({content: `Sharpened the image with an amount of **${amount}** and sigma of **${sigma}**!`, files: [attachment]})
        return
    }
}
