import {Message, SlashCommandBuilder, SlashCommandStringOption} from "discord.js"
import {Command} from "../../structures/Command"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Letters} from "./../../structures/Letters"

export default class Emojify extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Converts text to emoji letters.",
            help:
            `
            \`emojify text\` - Converts the text to emoji letters.
            `,
            examples:
            `
            \`=>emojify kawaii\`
            `,
            aliases: [],
            cooldown: 3,
            slashEnabled: true
        })
        const textOption = new SlashCommandStringOption()
            .setName("text")
            .setDescription("Text to convert to emoji letters.")
            .setRequired(true)

        this.slash = new SlashCommandBuilder()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addStringOption(textOption)
            .toJSON()
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const letters = new Letters(discord)

        const text = Functions.combineArgs(args, 1)
        if (!text) return message.reply("You did not provide any text.")
        console.log(text)
        const emojiFied = letters.letters(text)
        message.reply(`${emojiFied}`)
        return

    }
}
