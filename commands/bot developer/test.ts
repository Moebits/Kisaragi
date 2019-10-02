import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Test extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {

        console.log("here")
        const prefix = await SQLQuery.fetchPrefix(message)
        console.log(prefix)
        await SQLQuery.updatePrefix(message, "g!")
        const prefix2 = await SQLQuery.fetchPrefix(message)
        console.log(prefix2)
        await SQLQuery.updatePrefix(message, "=>")
        const prefix4 = await SQLQuery.fetchPrefix(message)
        console.log(prefix4)
    }
}
