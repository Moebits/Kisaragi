import {Message, MessageAttachment} from "discord.js"
import gm from "gm"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Brightness extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Flips an image horizontally, vertically, or both.",
          help:
          `
          _Note: Flip = vertical flip, flop = horizontal flip, flipflop = both._
          \`flip\` - Flips the image vertically.
          \`flop\` - Flops the image horizontally.
          \`flipflop\` - Flips the image in both directions.
          \`flip/flop horizontal/h? vertical/v?\` Alternative aliases.
          `,
          examples:
          `
          \`=>flip\`
          \`=>flop\`
          \`=>flipflop\`
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
        if (args[4] && !args[4].match(/vertical|horizontal|h|v/)) {
            url = args[4]
        } else if (args[3] && !args[3].match(/vertical|horizontal|h|v/)) {
            url = args[3]
        } else if (args[2] && !args[2].match(/vertical|horizontal|h|v/)) {
            url = args[2]
        } else {
            url = await discord.fetchLastAttachment(message)
        }
        if (!url) return message.reply(`Could not find an image ${discord.getEmoji("kannaCurious")}`)
        const image = gm(url)
        const input = Functions.combineArgs(args, 1).replace(url, "").trim()
        let setHorizontal = true
        let setVertical = false
        if (args[0] === "flop") {
            setVertical = true
            setHorizontal = false
        }
        if (input.match(/vertical|v/)) {
            setVertical = true
            setHorizontal = false
        }
        if (input.match(/horizontal|h/)) {
            setHorizontal = true
        }
        if (args[0] === "flipflop") {
            setHorizontal = true
            setVertical = true
        }
        if (setHorizontal) image.flop()
        if (setVertical) image.flip()
        let buffer: Buffer
        await new Promise((resolve) => {
            image.toBuffer((err, buf) => {
                buffer = buf
                resolve()
            })
        })
        const attachment = new MessageAttachment(buffer!)
        let text = "Flipped the image!"
        if (setHorizontal && setHorizontal) {
            text = "Flipped the image **horizontally** and **vertically**!"
        } else if (setHorizontal) {
            text = "Flipped the image **horizontally**!"
        } else if (setVertical) {
            text = "Flipped the image **vertically**!"
        }
        await message.reply(text, attachment)
        return
    }
}
