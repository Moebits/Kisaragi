exports.run = async (discord: any, message: any, args: string[]) => {
    const giphy = require('giphy-api')(process.env.GIPHY_API_KEY);
    let query = discord.combineArgs(args, 1);
    const giphyEmbed = discord.createEmbed();
    let gif;
    if (query) {
        let result = await giphy.random(query);
        gif = result.data;
    } else {
        let result = await giphy.trending();
        let random = Math.floor(Math.random() * result.data.length);
        gif = result.data[random];
    } 

    giphyEmbed
    .setAuthor("giphy", "https://media0.giphy.com/media/YJBNjrvG5Ctmo/giphy.gif")
    .setTitle(`**Giphy Gif** ${discord.getEmoji("raphi")}`)
    .setURL(gif.url)
    .setDescription(
        `${discord.getEmoji("star")}_Title:_ **${gif.title}**\n` +
        `${discord.getEmoji("star")}_Creation Date:_ **${discord.formatDate(gif.import_datetime)}**\n` +
        `${discord.getEmoji("star")}_Sourcle Post:_ ${gif.source_post_url ? gif.source_post_url : "None"}\n` 
    )
    .setImage(gif.images.original.url)
    message.channel.send(giphyEmbed);
}