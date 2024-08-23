import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

const animeQuotes = require("animequotes")

export default class AnimeQuote extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Posts a random anime quote.",
            help:
            `
            _Note: Search for japanese names. Punctuation and capitalization could matter._
            \`animequote\` - Gets a random quote.
            \`animequote id\` - Gets a quote with the given id.
            \`animequote anime\` - Searches for a quote in the given anime.
            \`animequote character\` - Searches for a quote by the given character.
            `,
            examples:
            `
            \`=>animequote\`
            \`=>animequote 6969\`
            \`=>animequote pokemon\`
            \`=>animequote himouto\`
            \`=>animequote rem\`
            `,
            aliases: ["aq"],
            random: "none",
            cooldown: 5
        })
    }

    public replaceQuery = (query: string) => {
        query = Functions.toProperCase(query)
        query = query
        .replace(/pokemon/gi, "Pokémon")
        .replace(/clannad/gi, "CLANNAD")
        .replace(/full metal panic/gi, "Full Metal Panic!")
        .replace(/re:?zero/gi, "Re:Zero kara Hajimeru Isekai Seikatsu")
        .replace(/sao 2/gi, "Sword Art Online II")
        .replace(/sao/gi, "Sword Art Online")
        .replace(/himouto!?/gi, "Himouto! Umaru-chan")
        .replace(/rem/gi, "Rem (re:zero)")
        .replace(/No/g, "no")
        return query
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        if (discord.checkMuted(message)) if (!perms.checkNSFW()) return

        const animeQuoteEmbed = embeds.createEmbed()
        .setAuthor({name: "animequotes", iconURL: "https://discordemoji.com/assets/emoji/KannaCurious.png"})
        .setTitle(`**Anime Quote** ${discord.getEmoji("raphi")}`)

        if (!args[1]) {
            const quote = animeQuotes.randomQuote()
            animeQuoteEmbed
            .setDescription(
            `${discord.getEmoji("star")}_ID:_ **${quote.id}**\n` +
            `${discord.getEmoji("star")}_Anime:_ **${quote.anime}**\n` +
            `${discord.getEmoji("star")}_Character:_ **${quote.name}**\n` +
            `${discord.getEmoji("star")}_Quote:_ ${quote.quote}`
            )
            return message.channel.send({embeds: [animeQuoteEmbed]})
        } else {
            let query = Functions.combineArgs(args, 1).trim()
            query = this.replaceQuery(query)
            if (query.match(/\d+/)) {
                const quote = animeQuotes.getQuote(Number(query))[0]
                if (quote === undefined) {
                    return this.invalidQuery(animeQuoteEmbed, "Could not find a quote!")
                }
                animeQuoteEmbed
                .setDescription(
                `${discord.getEmoji("star")}_ID:_ **${quote.id}**\n` +
                `${discord.getEmoji("star")}_Anime:_ **${quote.anime}**\n` +
                `${discord.getEmoji("star")}_Character:_ **${quote.name}**\n` +
                `${discord.getEmoji("star")}_Quote:_ ${quote.quote}`
                )
                return message.channel.send({embeds: [animeQuoteEmbed]})
            }

            let quote = animeQuotes.getQuotesByAnime(query)
            let random = Math.floor(Math.random() * quote.length)
            quote = quote[random]
            if (quote === undefined) {
                    let aniQuote = animeQuotes.getQuotesByCharacter(query)
                    random = Math.floor(Math.random() * aniQuote.length)
                    aniQuote = aniQuote[random]
                    if (aniQuote === undefined) {
                        return this.invalidQuery(animeQuoteEmbed, "Could not find a quote!")
                    }
                    animeQuoteEmbed
                    .setDescription(
                    `${discord.getEmoji("star")}_ID:_ **${aniQuote.id}**\n` +
                    `${discord.getEmoji("star")}_Anime:_ **${aniQuote.anime}**\n` +
                    `${discord.getEmoji("star")}_Character:_ **${aniQuote.name}**\n` +
                    `${discord.getEmoji("star")}_Quote:_ ${aniQuote.quote}`
                    )
                    return message.channel.send({embeds: [animeQuoteEmbed]})
                }
            animeQuoteEmbed
                .setDescription(
                `${discord.getEmoji("star")}_ID:_ **${quote.id}**\n` +
                `${discord.getEmoji("star")}_Anime:_ **${quote.anime}**\n` +
                `${discord.getEmoji("star")}_Character:_ **${quote.name}**\n` +
                `${discord.getEmoji("star")}_Quote:_ ${quote.quote}`
                )
            return message.channel.send({embeds: [animeQuoteEmbed]})
            }
    }
}
