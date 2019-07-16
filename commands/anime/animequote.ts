exports.run = async (client: any, message: any, args: string[]) => {

    const animeQuotes = require("animequotes");
    const animeQuoteEmbed = client.createEmbed();

    if (!args[1]) {
        let quote = animeQuotes.randomQuote();
        animeQuoteEmbed
        .setTitle(`**Anime Quote** ${client.getEmoji("raphi")}`)
        .addField("**Anime**", quote.anime)
        .addField("**Character**", quote.name)
        .setDescription(quote.quote)
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
                .setTitle(`**Anime Quote** ${client.getEmoji("raphi")}`)
                .addField("**Anime**", quote.anime)
                .addField("**Character**", quote.name)
                .setDescription(quote.quote)
                message.channel.send(animeQuoteEmbed);
                return;
            }
        animeQuoteEmbed
        .setTitle(`**Anime Quote** ${client.getEmoji("raphi")}`)
        .addField("**Anime**", quote.anime)
        .addField("**Character**", quote.name)
        .setDescription(quote.quote)
        message.channel.send(animeQuoteEmbed);
        }
}

