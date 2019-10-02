import axios from "axios"
import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Shorten extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const input = Functions.combineArgs(args, 1)
        const json = await axios.get(`https://is.gd/create.php?format=json&url=${input.trim()}`)
        const newLink = json.data.shorturl
        message.channel.send(newLink)
    }
}
