import {Message} from "discord.js"
import {SlashCommandSubcommand, SlashCommandOption} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"
import {SQLQuery} from "../../structures/SQLQuery"

export default class HelloWorld extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Hello world!",
            help:
            `
            \`helloworld\` - Responds with hello world.
            `,
            examples:
            `
            \`=>helloworld\`
            `,
            aliases: ["hello", "hi"],
            random: "none",
            cooldown: 3,
            subcommandEnabled: true
        })
        this.subcommand = new SlashCommandSubcommand()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
    }

    public run = async (args: string[]) => {
        const message = this.message

        if (args[0] === "helloworld") {
            return this.reply("Hello World!")
        } else if (args[0] === "hello") {
            return this.reply("Hello!")
        } else {
            return this.reply("Hi!")
        }
    }
}
