import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Letters} from "./../../structures/Letters"

export default class Emojify extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Emojify the text.",
            aliases: [],
            cooldown: 3
        })
    }

    public run = (discord: Kisaragi, message: Message, args: string[]) => {
        const letters = new Letters(discord)

        const text = Functions.combineArgs(args, 1)
        const emojiFied = letters.letters(text)
        message.channel.send(`>${emojiFied}`)

    }
}
