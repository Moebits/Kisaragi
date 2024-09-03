import {Message, SlashCommandBuilder, SlashCommandStringOption} from "discord.js"
import {Command} from "../../structures/Command"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class ReverseText extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Reverses your message.",
            help:
            `
            \`reversetext text\` - Sends the message in reverse.
            `,
            examples:
            `
            \`=>reversetext noon\`
            `,
            aliases: ["rtext", "rsay", "sayreverse"],
            cooldown: 3,
            slashEnabled: true
        })
        const textOption = new SlashCommandStringOption()
            .setName("text")
            .setDescription("The text to reverse.")
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

        const text = Functions.combineArgs(args, 1)
        if (!text) return message.reply("You did not provide any text.")

        return message.reply(text.split("").reverse().join(""))
    }
}
