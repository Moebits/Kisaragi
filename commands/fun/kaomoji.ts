import {Message} from "discord.js"
import * as kaomoji from "kaomojilib"
import {Command} from "../../structures/Command"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Kaomoji extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
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
        for (const i in lib) {
            for (const j in lib[i].keywords) {
                if (query.toLowerCase().trim() === lib[i].keywords[j].toLowerCase()) {
                    message.channel.send(lib[i].icon)
                    return
                }
            }
        }
        message.channel.send("No kaomoji were found.")
    }
}
