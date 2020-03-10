import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Skip extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Skips forward in the queue of songs.",
            help:
            `
            \`skip num?\` - Skips the amount (default 1)
            `,
            examples:
            `
            \`=>skip 5\`
            `,
            aliases: [],
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const audio = new Audio(discord, message)

        let amount = 1
        if (Number(args[1])) {
            amount = Number(args[1])
        }

        await audio.skip(amount)
        return
    }
}
