import {Message, AttachmentBuilder} from "discord.js"
import {SlashCommandOption} from "../../structures/SlashCommandOption"
import jimp from "jimp"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Brightness extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
          description: "Flips an image horizontally, vertically, or both.",
          help:
          `
          _Note: Some param aliases that can be used are horizontal, h, vertical, and v._
          \`flip x?\` - Flips the image horizontally (the default)
          \`flip y\` - Flips an image vertically.
          \`flip xy\` - Flips the image in both directions.
          \`flop yx\` - Inverse of flip (vertical becomes the default).
          \`flipflop\` - Alias for flipping in both directions.
          `,
          examples:
          `
          \`=>flip\`
          \`=>flip y\`
          `,
          aliases: ["flop", "flipflop"],
          cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        let url: string | undefined
        if (args[4] && !args[4].match(/x|y|vertical|horizontal|h|v/)) {
            url = args[4]
        } else if (args[3] && !args[3].match(/x|y|vertical|horizontal|h|v/)) {
            url = args[3]
        } else if (args[2] && !args[2].match(/x|y|vertical|horizontal|h|v/)) {
            url = args[2]
        } else {
            url = await discord.fetchLastAttachment(message)
        }
        if (!url) return message.reply(`Could not find an image ${discord.getEmoji("kannaCurious")}`)
        const image = await jimp.read(url)
        const input = Functions.combineArgs(args, 1).replace(url, "").trim()
        let setHorizontal = true
        let setVertical = false
        if (args[0] === "flop") {
            setHorizontal = false
            setVertical = true
        }
        if (input.match(/vertical|v|y/)) {
            setVertical = true
            setHorizontal = false
        }
        if (input.match(/horizontal|h|x/)) {
            setHorizontal = true
        }
        if (args[0] === "flipflop") {
            setHorizontal = true
            setVertical = true
        }
        if (setHorizontal) image.flip(true, false)
        if (setVertical) image.flip(false, true)
        const buffer = await image.getBufferAsync(jimp.MIME_PNG)
        const attachment = new AttachmentBuilder(buffer!)
        let text = "Flipped the image!"
        if (setHorizontal && setVertical) {
            text = "Flipped the image **horizontally** and **vertically**!"
        } else if (setHorizontal) {
            text = "Flipped the image **horizontally**!"
        } else if (setVertical) {
            text = "Flipped the image **vertically**!"
        }
        await message.reply({content: text, files: [attachment]})
        return
    }
}
