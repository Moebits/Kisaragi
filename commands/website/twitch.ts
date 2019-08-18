exports.run = async (discord: any, message: any, args: string[]) => {
    const TwitchClient = require("twitch").default;
    const twitch = await TwitchClient.withCredentials(process.env.TWITCH_CLIENT_ID, process.env.TWITCH_ACCESS_TOKEN);

    if (args[1] === "channel") {
        let term = args[2];
        let result = await twitch.kraken.search.searchChannels(term, 1, 1);
        let twitchEmbed = discord.createEmbed();
        twitchEmbed
        .setAuthor("twitch", "http://videoadnews.com/wp-content/uploads/2014/05/twitch-icon-box.jpg")
        .setTitle(`**Twitch Channel** ${discord.getEmoji("gabSip")}`)
        .setURL(result[0]._data.url)
        .setThumbnail(result[0]._data.logo)
        .setImage(result[0]._data.profile_banner)
        .setDescription(
            `${discord.getEmoji("star")}_Name:_ **${result[0].name}**\n` +
            `${discord.getEmoji("star")}_Creation Date:_ **${discord.formatDate(result[0].creationDate.getTime())}**\n` +
            `${discord.getEmoji("star")}_Views:_ **${result[0].views}**\n` +
            `${discord.getEmoji("star")}_Followers:_ **${result[0].followers}**\n` +
            `${discord.getEmoji("star")}_Status:_ **${result[0].status}**\n` +
            `${discord.getEmoji("star")}_Game:_ **${result[0].game}**\n` +
            `${discord.getEmoji("star")}_Description:_ ${result[0].description}\n`
        )
        message.channel.send(twitchEmbed)
        return;
    }

    let term = discord.combineArgs(args, 1);
    let result = await twitch.kraken.search.searchStreams(term.trim(), 1, 11);
    let twitchArray: any = [];
    for (let i = 0; i < result.length; i++) {
        let twitchEmbed = discord.createEmbed();
        twitchEmbed
        .setAuthor("twitch", "http://videoadnews.com/wp-content/uploads/2014/05/twitch-icon-box.jpg")
        .setTitle(`**Twitch Stream** ${discord.getEmoji("gabSip")}`)
        .setURL(result[i]._data.channel.url)
        .setImage(result[i]._data.preview.large)
        .setThumbnail(result[i]._data.channel.logo)
        .setDescription(
            `${discord.getEmoji("star")}_Title:_ **${result[i].channel.status}**\n` +
            `${discord.getEmoji("star")}_Channel:_ **${result[i].channel.name}**\n` +
            `${discord.getEmoji("star")}_Game:_ **${result[i].channel.game}**\n` +
            `${discord.getEmoji("star")}_Viewers:_ **${result[i].viewers}**\n` +
            `${discord.getEmoji("star")}_Creation Date:_ **${discord.formatDate(result[i].creationDate.getTime())}**\n` +
            `${discord.getEmoji("star")}_FPS:_ **${Math.floor(result[i].averageFPS)}**\n` +
            `${discord.getEmoji("star")}_Description:_ ${result[i].channel.description}\n`
        )
        twitchArray.push(twitchEmbed);
    }
    
    discord.createReactionEmbed(twitchArray);
}
