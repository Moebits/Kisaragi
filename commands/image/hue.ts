import {Message, AttachmentBuilder} from "discord.js"
import jimp from "jimp"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Hue extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Shifts the hue of an image.",
          help:
          `
          _Note: Hue is in degrees._
          \`hue shift\` - Shifts the hue of the last posted image
          \`hue shift url\` - Shifts the hue of the linked image
          `,
          examples:
          `
          \`=>hue 180\`
          `,
          aliases: ["spin"],
          cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        let url: string | undefined
        const shift = Number(args[1]) ? Number(args[1]) : 0
        if (args[2]) {
            url = args[2]
        } else {
            url = await discord.fetchLastAttachment(message)
        }
        if (!url) return message.reply(`Could not find an image ${discord.getEmoji("kannaCurious")}`)
        const image = await jimp.read(url)
        image.color([{apply: "hue" as any, params: [shift]}])
        const buffer = await image.getBufferAsync(jimp.MIME_PNG)
        const attachment = new AttachmentBuilder(buffer)
        await message.reply({content: `Shifted the hue **${shift}** degrees!`, files: [attachment]})
        return
    }
}
