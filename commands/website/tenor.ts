exports.run = async (client: any, message: any, args: string[]) => {
    const tenor = require("tenorjs").client({
        "Key": process.env.TENOR_API_KEY,
        "Filter": "off", 
        "Locale": "en_US", 
        "MediaFilter": "minimal", 
        "DateFormat": "MM/DD/YYYY" 
    });

    let query = client.combineArgs(args, 1);
    const tenorEmbed = client.createEmbed();
    let result;
    if (query) {
        result = await tenor.Search.Random(query, "1");
    } else {
        result = await tenor.Trending.GIFs("10");
    } 

    let random = Math.floor(Math.random() * result.length);
    tenorEmbed
    .setAuthor("tenor", "https://tenor.com/assets/img/tenor-app-icon.png")
    .setTitle(`**Tenor Gif** ${client.getEmoji("raphi")}`)
    .setURL(result[random].itemurl)
    .setDescription(
        `${client.getEmoji("star")}_Title:_ **${result[random].title}**\n` +
        `${client.getEmoji("star")}_Creation Date:_ **${client.formatDate(result[random].created)}**`
    )
    .setImage(result[random].media[0].gif.url)
    message.channel.send(tenorEmbed);
    
}