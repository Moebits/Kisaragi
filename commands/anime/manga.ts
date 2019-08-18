import {Message} from "discord.js";

exports.run = async (discord: any, message: Message, args: string[]) => {
    const weeb = require('node-weeb');
    let query = discord.combineArgs(args, 1);
    const mangaEmbed = discord.createEmbed();

    if (!query) {
        mangaEmbed
        .setAuthor("kitsu", "https://avatars0.githubusercontent.com/u/7648832?s=280&v=4")
        .setTitle(`**Manga** ${discord.getEmoji("gabYes")}`)
        .setDescription("You must provide a manga to search!")
        message.channel.send(mangaEmbed)
        return;
    }
 
    let result = await weeb.manga(query)
    let data = JSON.parse(result).data[0];
    mangaEmbed
    .setAuthor("kitsu", "https://avatars0.githubusercontent.com/u/7648832?s=280&v=4")
    .setURL(`https://kitsu.io/manga/${data.attributes.slug}`)
    .setTitle(`${data.attributes.titles.en} ${discord.getEmoji("gabYes")}`)
    .setDescription(
        `${discord.getEmoji("star")}_Japanese Title:_ **${data.attributes.titles.ja_jp}**\n` +
        `${discord.getEmoji("star")}_Most Popular Rank:_ **#${data.attributes.popularityRank}**\n` +
        `${discord.getEmoji("star")}_Community Approval:_ **${data.attributes.averageRating}%**\n` +
        `${discord.getEmoji("star")}_Highly Rated Rank:_ **#${data.attributes.ratingRank}**\n` +
        `${discord.getEmoji("star")}_Chapters:_ **${data.attributes.chapterCount ? data.attributes.chapterCount : "Ongoing"}** _Volumes:_ **${data.attributes.volumeCount}**\n` +
        `${discord.getEmoji("star")}_User Count:_ **${data.attributes.userCount}**\n` +
        `${discord.getEmoji("star")}_Favorites:_ **${data.attributes.favoritesCount}**\n` +
        `${discord.getEmoji("star")}_Published:_ **${discord.formatDate(data.attributes.startDate)} to ${discord.formatDate(data.attributes.endDate)}**\n` +
        `${discord.getEmoji("star")}_Trailer:_ https://www.youtube.com/watch?v=${data.attributes.youtubeVideoId}\n` +
        `${discord.getEmoji("star")}_Age Rating:_ **${data.attributes.ageRatingGuide}**\n` +
        `${discord.getEmoji("star")}_Serialization:_ **${data.attributes.serialization}**\n` +
        `${discord.getEmoji("star")}_Synopsis:_ ${discord.checkChar(data.attributes.synopsis, 2000, ".")}\n`
    )
    .setImage(data.attributes.coverImage ? data.attributes.coverImage.original : data.attributes.posterImage.original)
    .setThumbnail(data.attributes.posterImage.original)
    message.channel.send(mangaEmbed)

    console.log(data)
}