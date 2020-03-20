import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Say extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Posts your message.",
            help:
            `
            \`say text\` - Posts the text.
            `,
            examples:
            `
            \`=>say I love you\`
            `,
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const message = this.message

        const prefix = await SQLQuery.fetchPrefix(message)

        const rawText = Functions.combineArgs(args, 1)
        if (!rawText) return message.reply("You did not provide any text.")
        await message.channel.send(Functions.checkChar(rawText, 2000, "."))
        if (message.content.startsWith(prefix[0])) {
            try {
                await message.delete()
            } catch {
                // Do nothing
            }
        }
        return

    }
}
