import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"

const Kuroshiro = require("kuroshiro")
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji")

export default class Romaji extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Converts japanese text to romaji.",
            help:
            `
            \`romaji text\` - Converts the text to romaji
            `,
            examples:
            `
            \`=>romaji 艦隊これくしょん\`
            `,
            aliases: ["romajinize"],
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
            .setTitle(`**Romaji Conversion** ${discord.getEmoji("kannaSip")}`))
        }
        const result = await kuroshiro.convert(input, {mode: "spaced", to: "romaji"})
        const cleanResult = result.replace(/<\/?[^>]+(>|$)/g, "")

        await message.channel.send(`**Romaji Conversion** ${discord.getEmoji("kannaSip")}`)
        message.channel.send(cleanResult)
    }
}
