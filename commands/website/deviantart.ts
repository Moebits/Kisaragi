exports.run = async (discord: any, message: any, args: string[]) => {
    const deviantArt = require('deviantnode');
    let id = process.env.DEVIANTART_discord_ID;
    let secret = process.env.DEVIANTART_discord_SECRET;

    let deviantArray: any = [];
    discord.createDeviantEmbed = (result: any) => {
        for (let i = 0; i < result.results.length; i++) {
            let deviation = result.results[i];
            if (!deviation.content) return;
            let deviantEmbed = discord.createEmbed();;
            deviantEmbed
            .setAuthor("deviantart", "https://www.shareicon.net/data/512x512/2016/11/22/855126_circle_512x512.png")
            .setTitle(`**DeviantArt Search** ${discord.getEmoji("aquaUp")}`)
            .setURL(deviation.url)
            .setImage(deviation.content.src)
            .setThumbnail(deviation.author.usericon)
            .setDescription(
                `${discord.getEmoji("star")}_Title:_ **${deviation.title}**\n` +
                `${discord.getEmoji("star")}_Author:_ **${deviation.author.username}**\n` +
                `${discord.getEmoji("star")}_Category:_ **${deviation.category}**\n` +
                `${discord.getEmoji("star")}_Creation Date:_ **${discord.formatDate(Number(deviation.published_time) * 1000)}**\n` +
                `${discord.getEmoji("star")}_Comments:_ **${deviation.stats.comments}**\n` +
                `${discord.getEmoji("star")}_Favorites:_ **${deviation.stats.favorites ? deviation.stats.favorites : 0}**\n` +
                `${discord.getEmoji("star")}_Description:_ ${deviation.excerpt ? discord.checkChar(deviation.excerpt, 1900, ".") : "None"}\n`
            )
            deviantArray.push(deviantEmbed);
        }
    }

    if (args[1] === "daily") {
        let result;
        if (args[2]) {
            result = await deviantArt.getDailyDeviations(id, secret, {date: args[2]});
        } else {
            result = await deviantArt.getDailyDeviations(id, secret);
        }
        discord.createDeviantEmbed(result);
        if (deviantArray.length === 1) {
            message.channel.send(deviantArray[0]);
        } else {
            discord.createReactionEmbed(deviantArray)
        }
        return;
    }

    if (args[1] === "hot") {
        let result;
        if (args[2]) {
            result = await deviantArt.getHotDeviations(id, secret, {category: args[2]});
        } else {
            result = await deviantArt.getHotDeviations(id, secret);
        }
        discord.createDeviantEmbed(result);
        if (deviantArray.length === 1) {
            message.channel.send(deviantArray[0]);
        } else {
            discord.createReactionEmbed(deviantArray)
        }
        return;
    }

    if (args[1] === "new") {
        let query = discord.combineArgs(args, 2)
        let result;
        if (query) {
            result = await deviantArt.getNewestDeviations(id, secret, {q: query});
        } else {
            result = await deviantArt.getNewestDeviations(id, secret);
        }
        discord.createDeviantEmbed(result);
        if (deviantArray.length === 1) {
            message.channel.send(deviantArray[0]);
        } else {
            discord.createReactionEmbed(deviantArray)
        }
        return;
    }

    if (args[1] === "popular") {
        let query = discord.combineArgs(args, 2)
        let result;
        if (query) {
            result = await deviantArt.getPopularDeviations(id, secret, {q: query});
        } else {
            result = await deviantArt.getPopularDeviations(id, secret);
        }
        discord.createDeviantEmbed(result);
        if (deviantArray.length === 1) {
            message.channel.send(deviantArray[0]);
        } else {
            discord.createReactionEmbed(deviantArray)
        }
        return;
    }

    if (args[1] === "user") {
        let result = await deviantArt.getUserInfo(id, secret, {username: args[2]});
        console.log(result)
        let deviantEmbed = discord.createEmbed();
        deviantEmbed
        .setAuthor("deviantart", "https://www.shareicon.net/data/512x512/2016/11/22/855126_circle_512x512.png")
        .setTitle(`**DeviantArt User** ${discord.getEmoji("aquaUp")}`)
        .setURL(result.profile_url)
        .setThumbnail(result.user.usericon)
        .setImage(result.cover_photo ? result.cover_photo : result.user.usericon)
        .setDescription(
            `${discord.getEmoji("star")}_User:_ **${result.user.username}**\n` +
            `${discord.getEmoji("star")}_Specialty:_ **${result.artist_specialty}**\n` +
            `${discord.getEmoji("star")}_Country:_ **${result.country}**\n` +
            `${discord.getEmoji("star")}_Website:_ **${result.website ? result.website : "None"}**\n` +
            `${discord.getEmoji("star")}_Deviations:_ **${result.stats.user_deviations}**\n` +
            `${discord.getEmoji("star")}_User Favorites:_ **${result.stats.user_favourites}**\n` +
            `${discord.getEmoji("star")}_User Comments:_ **${result.stats.user_comments}**\n` +
            `${discord.getEmoji("star")}_Page Views:_ **${result.stats.profile_pageviews}**\n` +
            `${discord.getEmoji("star")}_Profile Comments:_ **${result.stats.profile_comments}**\n` +
            `${discord.getEmoji("star")}_Tag Line:_ ${result.tagline ? result.tagline : "None"}\n` +
            `${discord.getEmoji("star")}_Description:_ ${discord.checkChar(result.bio, 1800, ".")}\n` 
        )
        message.channel.send(deviantEmbed)
        return;
    }

    if (args[1] === "gallery") {
        let result = await deviantArt.getGalleryAllDeviations(id, secret, {username: args[2]});
        discord.createDeviantEmbed(result);
        if (deviantArray.length === 1) {
            message.channel.send(deviantArray[0]);
        } else {
            discord.createReactionEmbed(deviantArray)
        }
        return;
    }

    let query = discord.combineArgs(args, 1)
    let result = await deviantArt.getTagDeviations(id, secret, {tag: query});
    discord.createDeviantEmbed(result);
        if (deviantArray.length === 1) {
            message.channel.send(deviantArray[0]);
        } else {
            discord.createReactionEmbed(deviantArray)
        }
    return;
}