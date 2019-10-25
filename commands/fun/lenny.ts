import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Kisaragi} from "./../../structures/Kisaragi"

const lenny = require("lenny")

export default class Lenny extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Posts a lenny emoji.",
            help:
            `
            \`lenny\` - Posts a lenny emoji.
            \`lenny face/shrug/tableflip/unflip\` - Posts one of these popular faces.
            \`lenny query\` - Searches for a lenny emoji with the query.
            `,
            examples:
            `
            \`=>lenny\`
            \`=>lenny face\`
            \`=>lenny shrug\`
            `,
            aliases: [],
            cooldown: 3
        })
    }

    public run = (args: string[]) => {
        const message = this.message

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
