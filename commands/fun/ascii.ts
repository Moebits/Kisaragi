import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Ascii extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Converts text to ascii art.",
            help:
            `
            _Note: Long texts will get chopped off._
            \`ascii text\` - Converts the text to ascii.
            `,
            examples:
            `
            \`=>ascii hi\`
            `,
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const figlet = require("figlet")

        const text = Functions.combineArgs(args, 1)
        if (!text) return message.reply("You did not provide any text.")
        const asciiText = figlet.textSync(text)
        const asciiEmbed = embeds.createEmbed()
        asciiEmbed
        .setTitle(`**Ascii Art** ${discord.getEmoji("kannaSip")}`)
        .setDescription("```" + Functions.checkChar(asciiText, 2000, "|") + "```")
        message.channel.send(asciiEmbed)
    }
}
