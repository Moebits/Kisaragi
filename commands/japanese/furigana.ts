import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

const Kuroshiro = require("kuroshiro")
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji")

export default class Furigana extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Adds furigana to japanese text.",
            help:
            `
            \`furigana text\` - Adds furigana to the text
            `,
            examples:
            `
            \`=>furigana 艦隊これくしょん\`
            `,
            aliases: [],
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const kuroshiro = new Kuroshiro()
        await kuroshiro.init(new KuromojiAnalyzer())

        const input = Functions.combineArgs(args, 1)
        if (!input) {
            return this.noQuery(embeds.createEmbed()
            .setAuthor("kuroshiro", "https://kuroshiro.org/kuroshiro.png")
            .setTitle(`**Furigana Conversion** ${discord.getEmoji("KannaXD")}`))
        }
        const result = await kuroshiro.convert(input, {mode: "furigana", to: "hiragana"})
        const cleanResult = result.replace(/<\/?[^>]+(>|$)/g, "")

        await message.channel.send(`**Furigana Conversion** ${discord.getEmoji("KannaXD")}`)
        message.channel.send(cleanResult)
    }
}
