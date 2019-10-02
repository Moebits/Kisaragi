import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class HelpCommands extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = (discord: Kisaragi, message: Message, args: string[]) => {
        // nothing
    }
}
