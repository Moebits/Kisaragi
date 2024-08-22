import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"

const Kuroshiro = require("kuroshiro")
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji")

export default class Katakana extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Converts japanese text to katakana.",
            help:
            `
            \`katakana text\` - Converts the text tokatakana
            `,
            examples:
            `
            \`=>katakana 艦隊これくしょん\`
            \`=>katakana tesuto\`
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
            .setAuthor({name: "kuroshiro", iconURL: "https://kuroshiro.org/kuroshiro.png"})
            .setTitle(`**Katakana Conversion** ${discord.getEmoji("kannaCurious")}`))
        }
        const result = await kuroshiro.convert(input, {mode: "spaced", to: "katakana"})
        const cleanResult = result.replace(/<\/?[^>]+(>|$)/g, "")

        await message.channel.send(`**Katakana Conversion** ${discord.getEmoji("kannaCurious")}`)
        message.channel.send(cleanResult)
    }
}
