import {Message, SlashCommandSubcommandBuilder} from "discord.js"
import {createSlashCommandOption} from "../../structures/SlashCommandOption"
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
            subcommandEnabled: true
        })
        const textOption = createSlashCommandOption()
            .setName("text")
            .setDescription("The text to reverse.")
            .setRequired(true)
            
        this.subcommand = new SlashCommandSubcommandBuilder()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addStringOption(textOption)
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message

        const text = Functions.combineArgs(args, 1)
        if (!text) return message.reply("You did not provide any text.")

        return message.reply(text.split("").reverse().join(""))
    }
}
