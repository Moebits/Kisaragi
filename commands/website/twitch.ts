exports.run = async (client: any, message: any, args: string[]) => {
    const TwitchClient = require("twitch").default;
    const twitch = await TwitchClient.withCredentials(process.env.TWITCH_CLIENT_ID, process.env.TWITCH_ACCESS_TOKEN);

    if (args[1] === "channel") {
        let term = args[2];
        let result = await twitch.kraken.search.searchChannels(term, 1, 1);
        let twitchEmbed = client.createEmbed();
        twitchEmbed
        .setAuthor("twitch", "http://videoadnews.com/wp-content/uploads/2014/05/twitch-icon-box.jpg")
        .setTitle(`**Twitch Channel** ${client.getEmoji("gabSip")}`)
        .setURL(result[0]._data.url)
        .setThumbnail(result[0]._data.logo)
        .setImage(result[0]._data.profile_banner)
        .setDescription(
            `${client.getEmoji("star")}_Name:_ **${result[0].name}**\n` +
            `${client.getEmoji("star")}_Creation Date:_ **${client.formatDate(result[0].creationDate.getTime())}**\n` +
            `${client.getEmoji("star")}_Views:_ **${result[0].views}**\n` +
            `${client.getEmoji("star")}_Followers:_ **${result[0].followers}**\n` +
            `${client.getEmoji("star")}_Status:_ **${result[0].status}**\n` +
            `${client.getEmoji("star")}_Game:_ **${result[0].game}**\n` +
            `${client.getEmoji("star")}_Description:_ ${result[0].description}\n`
        )
        message.channel.send(twitchEmbed)
        return;
    }

    let term = client.combineArgs(args, 1);
    let result = await twitch.kraken.search.searchStreams(term.trim(), 1, 11);
    let twitchArray: any = [];
    for (let i = 0; i < result.length; i++) {
        let twitchEmbed = client.createEmbed();
        twitchEmbed
        .setAuthor("twitch", "http://videoadnews.com/wp-content/uploads/2014/05/twitch-icon-box.jpg")
        .setTitle(`**Twitch Stream** ${client.getEmoji("gabSip")}`)
        .setURL(result[i]._data.channel.url)
        .setImage(result[i]._data.preview.large)
        .setThumbnail(result[i]._data.channel.logo)
        .setDescription(
            `${client.getEmoji("star")}_Title:_ **${result[i].channel.status}**\n` +
            `${client.getEmoji("star")}_Channel:_ **${result[i].channel.name}**\n` +
            `${client.getEmoji("star")}_Game:_ **${result[i].channel.game}**\n` +
            `${client.getEmoji("star")}_Viewers:_ **${result[i].viewers}**\n` +
            `${client.getEmoji("star")}_Creation Date:_ **${client.formatDate(result[i].creationDate.getTime())}**\n` +
            `${client.getEmoji("star")}_FPS:_ **${Math.floor(result[i].averageFPS)}**\n` +
            `${client.getEmoji("star")}_Description:_ ${result[i].channel.description}\n`
        )
        twitchArray.push(twitchEmbed);
    }
    
    client.createReactionEmbed(twitchArray);
}
