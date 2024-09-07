import {Message} from "discord.js"
import {SlashCommandOption} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"
import {SQLQuery} from "../../structures/SQLQuery"

export default class Hi extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
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
            aliases: ["hello"],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const message = this.message

        if (args[0] === "helloworld") {
            return message.channel.send("Hello World!")
        } else if (args[0] === "hello") {
            return message.channel.send("Hello!")
        } else {
            return message.channel.send("Hi!")
        }
    }
}
