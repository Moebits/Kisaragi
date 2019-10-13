import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

const kaomoji = require("kaomojilib")

export default class Kaomoji extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Post a kawaii emoji.",
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const message = this.message
        const lib: any = []
        const keys = Object.keys(kaomoji.library)
        for (let i = 0, n = keys.length; i < n; i++) {
            const key  = keys[i]
            lib[i] = kaomoji.library[key]
        }
        if (!args[1]) {
            const random = Math.floor(Math.random() * lib.length)
            message.channel.send(lib[random].icon)
            return
        }
        const query = Functions.combineArgs(args, 1)
        for (let i = 0; i < lib.length; i++) {
            for (let j = 0;  j < lib[i].keywords.length; j++) {
                if (query.toLowerCase().trim() === lib[i].keywords[j].toLowerCase()) {
                    message.channel.send(lib[i].icon)
                    return
                }
            }
        }
        message.channel.send("No kaomoji were found.")
    }
}
