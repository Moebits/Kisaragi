import {Message} from "discord.js"
import Kuroshiro from "kuroshiro"
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Romaji extends Command {
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
        const result = await kuroshiro.convert(input, {mode: "spaced", to: "romaji"})
        const cleanResult = result.replace(/<\/?[^>]+(>|$)/g, "")

        const romajiEmbed = embeds.createEmbed()
        romajiEmbed
        .setAuthor("kuroshiro", "https://kuroshiro.org/kuroshiro.png")
        .setTitle(`**Romaji Conversion** ${discord.getEmoji("kannaSip")}`)
        .setDescription(`${discord.getEmoji("star")}${cleanResult}`)
        message.channel.send(romajiEmbed)
    }
}
