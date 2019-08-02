import {Message} from "discord.js";

exports.run = async (client: any, message: Message, args: string[]) => {

    const animeQuotes = require("animequotes");
    const animeQuoteEmbed = client.createEmbed();

    if (!args[1]) {
        let quote = animeQuotes.randomQuote();
        animeQuoteEmbed
        .setAuthor("animequotes", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnI2SHuhdw8zEPc3xG0gfJyT4y2f8n4b_UKZCdjLQxnoI-2JEP")
        .setTitle(`**Anime Quote** ${client.getEmoji("raphi")}`)
        .setDescription(
        `${client.getEmoji("star")}_Anime:_ **${quote.anime}**\n` +
        `${client.getEmoji("star")}_Character:_ **${quote.name}**\n` +
        `${client.getEmoji("star")}_Quote:_ ${quote.quote}`
        )
        message.channel.send(animeQuoteEmbed);
        return;
    } else {
        let quote = animeQuotes.getQuotesByAnime(args[1]);
            if (quote.quote === undefined) {
                let quote = animeQuotes.getQuotesByCharacter(args[1]);
                if (quote.quote === undefined) {
                    animeQuoteEmbed
                    .setTitle(`**Anime Quote** ${client.getEmoji("raphi")}`)
                    .setDescription("Could not find a quote!")
                    message.channel.send(animeQuoteEmbed);
                    return;
                }
                animeQuoteEmbed
                .setAuthor("animequotes", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnI2SHuhdw8zEPc3xG0gfJyT4y2f8n4b_UKZCdjLQxnoI-2JEP")
                .setTitle(`**Anime Quote** ${client.getEmoji("raphi")}`)
                .setDescription(
                `${client.getEmoji("star")}_Anime:_ **${quote.anime}**\n` +
                `${client.getEmoji("star")}_Character:_ **${quote.name}**\n` +
                `${client.getEmoji("star")}_Quote:_ ${quote.quote}`
                )
                message.channel.send(animeQuoteEmbed);
                return;
            }
            animeQuoteEmbed
            .setAuthor("animequotes", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnI2SHuhdw8zEPc3xG0gfJyT4y2f8n4b_UKZCdjLQxnoI-2JEP")
            .setTitle(`**Anime Quote** ${client.getEmoji("raphi")}`)
            .setDescription(
            `${client.getEmoji("star")}_Anime:_ **${quote.anime}**\n` +
            `${client.getEmoji("star")}_Character:_ **${quote.name}**\n` +
            `${client.getEmoji("star")}_Quote:_ ${quote.quote}`
            )
            message.channel.send(animeQuoteEmbed);
        }
}

