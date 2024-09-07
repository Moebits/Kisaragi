import {Message, SlashCommandSubcommandBuilder} from "discord.js"
import {SlashCommandOption} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Ascii extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
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
            cooldown: 3,
            subcommandEnabled: true
        })
        const textOption = new SlashCommandOption()
            .setType("string")
            .setName("text")
            .setDescription("text content")
            .setRequired(true)
            
        this.subcommand = new SlashCommandSubcommandBuilder()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addStringOption(textOption)
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
        message.reply({embeds: [asciiEmbed]})
    }
}
