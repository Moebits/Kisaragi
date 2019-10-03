import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

const translate = require("@vitalets/google-translate-api")

export default class Japanese extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const translateText = Functions.combineArgs(args, 1)

        const result = await translate(translateText, {to: "ja"})
        if (result.from.language.iso === "ja") {
            const newResult = await translate(translateText, {to: "en"})
            await message.channel.send(`**Translated Text** ${discord.getEmoji("kannaCurious")}`)
            message.channel.send(newResult.text)
            return
        }
        await message.channel.send(`**Translated Text** ${discord.getEmoji("kannaCurious")}`)
        message.channel.send(result.text)
    }
}
