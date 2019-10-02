import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

const animeQuotes = require("animequotes")

export default class AnimeQuote extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)

        const animeQuoteEmbed = embeds.createEmbed()

        if (!args[1]) {
            const quote = animeQuotes.randomQuote()
            animeQuoteEmbed
            .setAuthor("animequotes", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnI2SHuhdw8zEPc3xG0gfJyT4y2f8n4b_UKZCdjLQxnoI-2JEP")
            .setTitle(`**Anime Quote** ${discord.getEmoji("raphi")}`)
            .setDescription(
            `${discord.getEmoji("star")}_Anime:_ **${quote.anime}**\n` +
            `${discord.getEmoji("star")}_Character:_ **${quote.name}**\n` +
            `${discord.getEmoji("star")}_Quote:_ ${quote.quote}`
            )
            message.channel.send(animeQuoteEmbed)
            return
        } else {
            const quote = animeQuotes.getQuotesByAnime(args[1])
            if (quote.quote === undefined) {
                    const aniQuote = animeQuotes.getQuotesByCharacter(args[1])
                    if (aniQuote.quote === undefined) {
                        animeQuoteEmbed
                        .setTitle(`**Anime Quote** ${discord.getEmoji("raphi")}`)
                        .setDescription("Could not find a quote!")
                        message.channel.send(animeQuoteEmbed)
                        return
                    }
                    animeQuoteEmbed
                    .setAuthor("animequotes", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnI2SHuhdw8zEPc3xG0gfJyT4y2f8n4b_UKZCdjLQxnoI-2JEP")
                    .setTitle(`**Anime Quote** ${discord.getEmoji("raphi")}`)
                    .setDescription(
                    `${discord.getEmoji("star")}_Anime:_ **${quote.anime}**\n` +
                    `${discord.getEmoji("star")}_Character:_ **${quote.name}**\n` +
                    `${discord.getEmoji("star")}_Quote:_ ${quote.quote}`
                    )
                    message.channel.send(animeQuoteEmbed)
                    return
                }
            animeQuoteEmbed
                .setAuthor("animequotes", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnI2SHuhdw8zEPc3xG0gfJyT4y2f8n4b_UKZCdjLQxnoI-2JEP")
                .setTitle(`**Anime Quote** ${discord.getEmoji("raphi")}`)
                .setDescription(
                `${discord.getEmoji("star")}_Anime:_ **${quote.anime}**\n` +
                `${discord.getEmoji("star")}_Character:_ **${quote.name}**\n` +
                `${discord.getEmoji("star")}_Quote:_ ${quote.quote}`
                )
            message.channel.send(animeQuoteEmbed)
            }
    }
}
