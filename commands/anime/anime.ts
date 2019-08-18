import {Message} from "discord.js";

exports.run = async (discord: any, message: Message, args: string[]) => {
    const weeb = require('node-weeb');
    let query = discord.combineArgs(args, 1);
    const animeEmbed = discord.createEmbed();

    if (!query) {
        animeEmbed
        .setAuthor("kitsu", "https://avatars0.githubusercontent.com/u/7648832?s=280&v=4")
        .setTitle(`**Anime** ${discord.getEmoji("gabYes")}`)
        .setDescription("You must provide an anime to search!")
        message.channel.send(animeEmbed)
        return;
    }
 
    let result = await weeb.anime(query)
    let data = JSON.parse(result).data[0];
    animeEmbed
    .setAuthor("kitsu", "https://avatars0.githubusercontent.com/u/7648832?s=280&v=4")
    .setURL(`https://kitsu.io/anime/${data.attributes.slug}`)
    .setTitle(`${data.attributes.titles.en} ${discord.getEmoji("gabYes")}`)
    .setDescription(
        `${discord.getEmoji("star")}_Japanese Title:_ **${data.attributes.titles.ja_jp}**\n` +
        `${discord.getEmoji("star")}_Most Popular Rank:_ **#${data.attributes.popularityRank}**\n` +
        `${discord.getEmoji("star")}_Community Approval:_ **${data.attributes.averageRating}%**\n` +
        `${discord.getEmoji("star")}_Highly Rated Rank:_ **#${data.attributes.ratingRank}**\n` +
        `${discord.getEmoji("star")}_Episodes:_ **${data.attributes.episodeCount ? data.attributes.episodeCount : "Still Airing"}** _Length:_ **${data.attributes.totalLength}m (${data.attributes.episodeLength}m each)**\n` +
        `${discord.getEmoji("star")}_User Count:_ **${data.attributes.userCount}**\n` +
        `${discord.getEmoji("star")}_Aired:_ **${discord.formatDate(data.attributes.startDate)} to ${discord.formatDate(data.attributes.endDate)}**\n` +
        `${discord.getEmoji("star")}_Age Rating:_ **${data.attributes.ageRatingGuide}**\n` +
        `${discord.getEmoji("star")}_Synopsis:_ ${discord.checkChar(data.attributes.synopsis, 2000, ".")}\n`
    )
    .setImage(data.attributes.coverImage ? data.attributes.coverImage.original : data.attributes.posterImage.original)
    .setThumbnail(data.attributes.posterImage.original)
    message.channel.send(animeEmbed)
}