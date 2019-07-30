exports.run = async (client: any, message: any, args: string[]) => {
    const snoowrap = require('snoowrap');

    const reddit = new snoowrap({
        userAgent: "kisaragi bot v1.0 by /u/tenpimusic",
        clientId: process.env.REDDIT_APP_ID,
        clientSecret: process.env.REDDIT_APP_SECRET,
        username: process.env.REDDIT_USERNAME,
        password: process.env.REDDIT_PASSWORD
      });

    let redditArray: any = [];
    client.getSubmissions = async (postIDS: string) => {
        for (let i = 0; i < 10; i++) {
            if (!postIDS[i]) break;
            let post = await reddit.getSubmission(postIDS[i]).fetch();
            let commentArray: any = [];
            for (let j = 0; j < 3; j++) {
                if (!post.comments[j]) break;
                commentArray.push(`**${post.comments[j].author ? post.comments[j].author.name : "Deleted"}**: ${client.checkChar(post.comments[j].body, 150, " ").replace(/(\r\n|\n|\r)/gm," ")}`);
            }
            let redditEmbed = client.createEmbed();
            redditEmbed
            .setAuthor("reddit", "https://cdn0.iconfinder.com/data/icons/most-usable-logos/120/Reddit-512.png")
            .setTitle(`**${post.title}** ${client.getEmoji("aquaUp")}`)
            .setURL(`https://www.reddit.com/${post.permalink}`)
            .setDescription(
                `${client.getEmoji("star")}_Subreddit:_ **${post.subreddit.display_name}**\n` +
                `${client.getEmoji("star")}_Subscribers:_ **${post.subreddit_subscribers}**\n` +
                `${client.getEmoji("star")}_Author:_ **${post.author ? post.author.name : "Deleted"}**\n` +
                `${client.getEmoji("star")}${client.getEmoji("up")} **${Math.ceil(post.ups / post.upvote_ratio)}** ${client.getEmoji("down")} **${Math.ceil(post.ups / post.upvote_ratio) - post.ups}**\n` +
                `${client.getEmoji("star")}_Selftext:_ ${post.selftext ? client.checkChar(post.selftext, 800, ".").replace(/(\r\n|\n|\r)/gm," ") : "None"}\n` +
                `${client.getEmoji("star")}_Comments:_ ${commentArray.join("") ? commentArray.join("\n") : "None"}\n`
            )
            .setImage(post.url)
            .setThumbnail(post.thumbnail.startsWith("https") ? post.thumbnail : post.url)
            redditArray.push(redditEmbed);
        }
    }
       
    if (args[1] === "user") {
        let query = client.combineArgs(args, 2);
        let user = await reddit.getUser(query.trim()).fetch();
        console.log(user)
        let redditEmbed = client.createEmbed();
        redditEmbed
        .setAuthor("reddit", "https://cdn0.iconfinder.com/data/icons/most-usable-logos/120/Reddit-512.png")
        .setTitle(`**${user.name}** ${client.getEmoji("aquaUp")}`)
        .setURL(`https://www.reddit.com${user.subreddit.display_name.url}`)
        .setImage(user.subreddit.display_name.banner_img)
        .setThumbnail(user.subreddit.display_name.icon_img)
        .setDescription(
            `${client.getEmoji("star")}_Link Karma:_ **${user.link_karma}**\n` +
            `${client.getEmoji("star")}_Comment Karma:_ **${user.comment_karma}**\n` +
            `${client.getEmoji("star")}_Friends:_ **${user.num_friends}**\n` +
            `${client.getEmoji("star")}_Description:_ ${user.subreddit.display_name.public_description}\n`
        )
        message.channel.send(redditEmbed);
        return;
    }

    let posts;
    let subreddit;
    if (!args[1]) {
        posts = [await reddit.getRandomSubmission()];
    } else {
        subreddit = args[1];
    }
    if (subreddit) {
        if (args[2]) {
            let query = client.combineArgs(args, 2);
            if (args[2].toLowerCase() === "hot") {
                posts = await reddit.getSubreddit(subreddit).getHot();
            } else if (args[2].toLowerCase() === "new") {
                posts = await reddit.getSubreddit(subreddit).getNew();
            } else if (args[2].toLowerCase() === "top") {
                posts = await reddit.getSubreddit(subreddit).getTop({time: "all"});
            } else if (args[2].toLowerCase() === "rising") {
                posts = await reddit.getSubreddit(subreddit).getRising();
            } else if (args[2].toLowerCase() === "controversial") {
                posts = await reddit.getSubreddit(subreddit).getControversial();
            } else {
                posts = await reddit.getSubreddit(subreddit).search({query: query, time: "all", sort: "relevance"});
            }
        } else {
            posts = await reddit.getSubreddit(subreddit).getRandomSubmission();
        }
    }
    let postIDS: any = [];
    for (let i in posts) {
        if (posts[i]) {
            postIDS.push(posts[i].id);
        }
    }
    if (!postIDS.join("")) {
        let redditEmbed = client.createEmbed();
            redditEmbed
            .setAuthor("reddit", "https://cdn0.iconfinder.com/data/icons/most-usable-logos/120/Reddit-512.png")
            .setTitle(`**Reddit Search** ${client.getEmoji("aquaUp")}`)
            .setDescription("No results were found. Try searching on the reddit website: " +
            "[Reddit Website](https://www.reddit.com)")
            message.channel.send(redditEmbed);
            return;
    }
    await client.getSubmissions(postIDS);
    if (redditArray.length === 1) {
        message.channel.send(redditArray[0]);
    } else {
        client.createReactionEmbed(redditArray);
    }
}