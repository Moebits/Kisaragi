exports.run = async (client: any, message: any, args: string[]) => {

    const Twitter = require('twitter');
    const twitter = new Twitter({
        consumer_key: process.env.TWITTER_API_KEY,
        consumer_secret: process.env.TWITTER_API_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN,
        access_token_secret: process.env.TWITTER_ACCESS_SECRET
    });

    if (args[1] === "user") {
        let name = client.combineArgs(args, 2);
        let users = await twitter.get("users/lookup", {screen_name: name});
        let user = users[0];
        let twitterEmbed = client.createEmbed();
        twitterEmbed
        .setAuthor("twitter", "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c53e.png")
        .setTitle(`**${user.name}** ${client.getEmoji("aquaUp")}`)
        .setURL(`https://twitter.com/${user.screen_name}`)
        .setDescription(
            `${client.getEmoji("star")}_Username:_ **${user.screen_name}**\n` +
            `${client.getEmoji("star")}_Tweets:_ **${user.statuses_count}**\n` +
            `${client.getEmoji("star")}_Followers:_ **${user.followers_count}**\n` +
            `${client.getEmoji("star")}_Following:_ **${user.friends_count}**\n` +
            `${client.getEmoji("star")}_Favorites:_ **${user.favourites_count}**\n` +
            `${client.getEmoji("star")}_Creation Date:_ **${client.formatDate(user.created_at)}**\n` +
            `${client.getEmoji("star")}_Location:_ ${user.location ? user.location : "None"}\n` +
            `${client.getEmoji("star")}_Description:_ ${user.description ? user.description : "None"}\n` +
            `${client.getEmoji("star")}_Last Tweet:_ ${user.status.text}\n` 
            )
        .setThumbnail(user.profile_image_url)
        .setImage(user.profile_banner_url)
        message.channel.send(twitterEmbed);
        return;
    }

    let query = client.combineArgs(args, 1);
    let tweets = await twitter.get("search/tweets", {q: query});
    let twitterArray: any = [];
    for (let i in tweets.statuses) {
        let twitterEmbed = client.createEmbed();
        twitterEmbed
        .setAuthor("twitter", "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c53e.png")
        .setTitle(`**Twitter Search** ${client.getEmoji("aquaUp")}`)
        .setURL(`https://twitter.com/${tweets.statuses[i].user.screen_name}/status/${tweets.statuses[i].id_str}`)
        .setDescription(
            `${client.getEmoji("star")}_Author:_ **${tweets.statuses[i].user.screen_name}**\n` +
            `${client.getEmoji("star")}_Location:_ ${tweets.statuses[i].user.location ? tweets.statuses[i].user.location : "None"}\n` +
            `${client.getEmoji("star")}_Description:_ ${tweets.statuses[i].user.description ? tweets.statuses[i].user.description : "None"}\n` +
            `${client.getEmoji("star")}_Favorites:_ **${tweets.statuses[i].favorite_count}**\n` +
            `${client.getEmoji("star")}_Retweets:_ **${tweets.statuses[i].retweet_count}**\n` +
            `${client.getEmoji("star")}_Creation Date:_ **${client.formatDate(tweets.statuses[i].created_at)}**\n` +
            `${client.getEmoji("star")}_Language:_ **${tweets.statuses[i].lang}**\n` +
            `${client.getEmoji("star")}_Tweet:_ ${tweets.statuses[i].text}\n` 
            )
        .setThumbnail(tweets.statuses[i].user.profile_image_url_https)
        .setImage(tweets.statuses[i].entities.media ? tweets.statuses[i].entities.media[0].media_url : tweets.statuses[i].user.profile_banner_url)
        twitterArray.push(twitterEmbed);
    }
    client.createReactionEmbed(twitterArray);
}