import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Say extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {

        const prefix = await SQLQuery.fetchPrefix(message)

        const rawText = Functions.combineArgs(args, 1)
        await message.channel.send(Functions.checkChar(rawText, 2000, "."))
        if (message.content.startsWith(prefix[0])) await message.delete()
        return

    }
}
