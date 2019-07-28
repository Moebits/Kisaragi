exports.run = async (client: any, message: any, args: string[]) => {
    const weeb = require('node-weeb');
    let query = client.combineArgs(args, 1);
    const animeEmbed = client.createEmbed();

    if (!query) {
        animeEmbed
        .setAuthor("kitsu", "https://avatars0.githubusercontent.com/u/7648832?s=280&v=4")
        .setTitle(`**Anime** ${client.getEmoji("gabYes")}`)
        .setDescription("You must provide an anime to search!")
        message.channel.send(animeEmbed)
        return;
    }
 
    let result = await weeb.anime(query)
    let data = JSON.parse(result).data[0];
    animeEmbed
    .setAuthor("kitsu", "https://avatars0.githubusercontent.com/u/7648832?s=280&v=4")
    .setURL(`https://kitsu.io/anime/${data.attributes.slug}`)
    .setTitle(`${data.attributes.titles.en} ${client.getEmoji("gabYes")}`)
    .setDescription(
        `${client.getEmoji("star")}_Japanese Title:_ **${data.attributes.titles.ja_jp}**\n` +
        `${client.getEmoji("star")}_Most Popular Rank:_ **#${data.attributes.popularityRank}**\n` +
        `${client.getEmoji("star")}_Community Approval:_ **${data.attributes.averageRating}%**\n` +
        `${client.getEmoji("star")}_Highly Rated Rank:_ **#${data.attributes.ratingRank}**\n` +
        `${client.getEmoji("star")}_Episodes:_ **${data.attributes.episodeCount ? data.attributes.episodeCount : "Still Airing"}** _Length:_ **${data.attributes.totalLength}m (${data.attributes.episodeLength}m each)**\n` +
        `${client.getEmoji("star")}_User Count:_ **${data.attributes.userCount}**\n` +
        `${client.getEmoji("star")}_Aired:_ **${client.formatDate(data.attributes.startDate)} to ${client.formatDate(data.attributes.endDate)}**\n` +
        `${client.getEmoji("star")}_Age Rating:_ **${data.attributes.ageRatingGuide}**\n` +
        `${client.getEmoji("star")}_Synopsis:_ ${client.checkChar(data.attributes.synopsis, 2000, ".")}\n`
    )
    .setImage(data.attributes.coverImage ? data.attributes.coverImage.original : data.attributes.posterImage.original)
    .setThumbnail(data.attributes.posterImage.original)
    message.channel.send(animeEmbed)
}