import {Message} from "discord.js"
import Kuroshiro from "kuroshiro"
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Katakana extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const kuroshiro = new Kuroshiro()
        await kuroshiro.init(new KuromojiAnalyzer())

        const input = Functions.combineArgs(args, 1)
        const result = await kuroshiro.convert(input, {mode: "spaced", to: "katakana"})
        const cleanResult = result.replace(/<\/?[^>]+(>|$)/g, "")

        const katakanaEmbed = embeds.createEmbed()
        katakanaEmbed
        .setAuthor("kuroshiro", "https://kuroshiro.org/kuroshiro.png")
        .setTitle(`**Katakana Conversion** ${discord.getEmoji("kannaSip")}`)
        .setDescription(`${discord.getEmoji("star")}${cleanResult}`)
        message.channel.send(katakanaEmbed)
    }
}
