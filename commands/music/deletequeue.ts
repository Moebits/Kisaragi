import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Shuffle extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Deletes the entire queue or a range.",
            help:
            `
            _Note: Valid ranges are a number, or two numbers separated by dash (eg. 3-5)._
            \`deletequeue range?\` - Deletes the queue, or the specified range.
            `,
            examples:
            `
            \`=>deletequeue\`
            \`=>deletequeue 1-5\`
            `,
            aliases: [],
            guildOnly: true,
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const audio = new Audio(discord, message)
        let rep: Message
        const input = Functions.combineArgs(args, 1)
        if (!Number(input) && !input.includes("-")) {
            audio.deleteQueue()
            rep = await message.reply("Deleted the queue!")
        } else {
            const newArgs = input.split("-")
            const pos = Number(newArgs[1])
            const end = Number(newArgs[2]) ? Number(args[2]) - Number(newArgs[1]) : 1
            audio.deleteQueue(pos, end)
            rep = await message.reply(`Deleted **${end}** songs starting at position **${pos}**!`)
        }
        rep.delete({timeout: 3000})
        return
    }
}
