import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class ReverseText extends Command {
    constructor(discord: Kisaragi, message: Message) {
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
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message

        const text = Functions.combineArgs(args, 1)
        if (!text) return message.reply("You did not provide any text.")

        return message.channel.send(text.split("").reverse().join(""))
    }
}
