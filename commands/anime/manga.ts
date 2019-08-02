import {Message} from "discord.js";

exports.run = async (client: any, message: Message, args: string[]) => {
    const weeb = require('node-weeb');
    let query = client.combineArgs(args, 1);
    const mangaEmbed = client.createEmbed();

    if (!query) {
        mangaEmbed
        .setAuthor("kitsu", "https://avatars0.githubusercontent.com/u/7648832?s=280&v=4")
        .setTitle(`**Manga** ${client.getEmoji("gabYes")}`)
        .setDescription("You must provide a manga to search!")
        message.channel.send(mangaEmbed)
        return;
    }
 
    let result = await weeb.manga(query)
    let data = JSON.parse(result).data[0];
    mangaEmbed
    .setAuthor("kitsu", "https://avatars0.githubusercontent.com/u/7648832?s=280&v=4")
    .setURL(`https://kitsu.io/manga/${data.attributes.slug}`)
    .setTitle(`${data.attributes.titles.en} ${client.getEmoji("gabYes")}`)
    .setDescription(
        `${client.getEmoji("star")}_Japanese Title:_ **${data.attributes.titles.ja_jp}**\n` +
        `${client.getEmoji("star")}_Most Popular Rank:_ **#${data.attributes.popularityRank}**\n` +
        `${client.getEmoji("star")}_Community Approval:_ **${data.attributes.averageRating}%**\n` +
        `${client.getEmoji("star")}_Highly Rated Rank:_ **#${data.attributes.ratingRank}**\n` +
        `${client.getEmoji("star")}_Chapters:_ **${data.attributes.chapterCount ? data.attributes.chapterCount : "Ongoing"}** _Volumes:_ **${data.attributes.volumeCount}**\n` +
        `${client.getEmoji("star")}_User Count:_ **${data.attributes.userCount}**\n` +
        `${client.getEmoji("star")}_Favorites:_ **${data.attributes.favoritesCount}**\n` +
        `${client.getEmoji("star")}_Published:_ **${client.formatDate(data.attributes.startDate)} to ${client.formatDate(data.attributes.endDate)}**\n` +
        `${client.getEmoji("star")}_Trailer:_ https://www.youtube.com/watch?v=${data.attributes.youtubeVideoId}\n` +
        `${client.getEmoji("star")}_Age Rating:_ **${data.attributes.ageRatingGuide}**\n` +
        `${client.getEmoji("star")}_Serialization:_ **${data.attributes.serialization}**\n` +
        `${client.getEmoji("star")}_Synopsis:_ ${client.checkChar(data.attributes.synopsis, 2000, ".")}\n`
    )
    .setImage(data.attributes.coverImage ? data.attributes.coverImage.original : data.attributes.posterImage.original)
    .setThumbnail(data.attributes.posterImage.original)
    message.channel.send(mangaEmbed)

    console.log(data)
}