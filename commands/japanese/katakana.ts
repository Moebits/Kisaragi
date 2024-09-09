import {Message} from "discord.js"
import {SlashCommandSubcommand, SlashCommandOption} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"
import Kuroshiro from "kuroshiro"
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji"

export default class Katakana extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
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
            cooldown: 5,
            subcommandEnabled: true
        })
        const textOption = new SlashCommandOption()
            .setType("string")
            .setName("text")
            .setDescription("Text to convert to katakana.")
            
        this.subcommand = new SlashCommandSubcommand()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addOption(textOption)
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

        await message.reply(`**Katakana Conversion** ${discord.getEmoji("kannaCurious")}`)
        message.channel.send(cleanResult)
    }
}
