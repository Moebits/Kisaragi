import {Message} from "discord.js"
import * as lenny from "lenny"
import {Command} from "../../structures/Command"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Lenny extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = (discord: Kisaragi, message: Message, args: string[]) => {

        if (args[1] === "face") {
            message.channel.send("( ͡° ͜ʖ ͡°)")
        } else if (args[1] === "shrug") {
            message.channel.send("¯\\_(ツ)_/¯")
        } else if (args[1] === "tableflip") {
            message.channel.send("(╯°□°）╯︵ ┻━┻")
        } else if (args[1] === "unflip") {
            message.channel.send("┬─┬ ノ( ゜-゜ノ)")
        } else {
            message.channel.send(lenny())
        }
    }
}
