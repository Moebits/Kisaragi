exports.run = async (discord: any, message: any, args: string[]) => {
    const GDClient = require('geometry-dash-api');
    const gd = require("gdprofiles");
    const base64 = require("base-64");

    const GD = new GDClient({
        userName: "Tenpi",
        password: process.env.GD_PASSWORD
    });

    const {api} = GD;
    await GD.login();

    if (args[1] === "user") {
        let nick = discord.combineArgs(args, 2);
        let user = await api.users.getByNick(nick);
        let gdUser = await gd.search(nick);
        console.log(gdUser)
        let levelArray: any = [];
        for (let i in gdUser.lastLevels) {
            levelArray.push(gdUser.lastLevels[i].name)
        }
        let gdEmbed = discord.createEmbed();
        gdEmbed
        .setAuthor("geometry dash", "https://tchol.org/images/geometry-dash-png-7.png")
        .setTitle(`**GD Profile** ${discord.getEmoji("raphi")}`)
        .setURL(`https://gdprofiles.com/${user.nick}`)
        .setDescription(
            `${discord.getEmoji("star")}${discord.getEmoji("gdStar")} **${user.stars}** ` +
            `${discord.getEmoji("gdDiamond")} **${user.diamonds}** ` +
            `${discord.getEmoji("gdCoin")} **${user.coins}** ` +
            `${discord.getEmoji("gdUserCoin")} **${user.userCoins}** ` +
            `${discord.getEmoji("gdDemon")} **${user.demons}** ` +
            `${discord.getEmoji("gdCP")} **${user.creatorPoints}** \n` + 
            `${discord.getEmoji("star")}_Name:_ **${user.nick}**\n` +
            `${discord.getEmoji("star")}_Rank:_ **#${user.top}**\n` +
            `${discord.getEmoji("star")}_User ID:_ **${user.userID}**\n` +
            `${discord.getEmoji("star")}_Account ID:_ **${user.accountID}**\n` +
            `${discord.getEmoji("star")}_Account Type:_ **${user.rightsString}**\n` +
            `${discord.getEmoji("star")}_Youtube:_ **${user.youtube}**\n` +
            `${discord.getEmoji("star")}_Twitter:_ **${user.twitter}**\n` +
            `${discord.getEmoji("star")}_Twitch:_ **${user.twitch}**\n` +
            `${discord.getEmoji("star")}_Description:_ ${gdUser.desc ? gdUser.desc : "None"}\n` +
            `${discord.getEmoji("star")}_Levels:_ ${levelArray.join("") ? levelArray.join(",     ") : "None"}\n` 
        )
        .setImage(`https://img.youtube.com/vi/${gdUser.video.embed.replace(/www.youtube.com\/embed\//g, "")}/maxresdefault.jpg`)
        .setThumbnail(gdUser.img.player)
        message.channel.send(gdEmbed);
        return;
    }

    if (args[1] === "daily") {
        const level = await api.levels.getDaily();
        let user = await api.users.getById(level.creatorUserID);
        let gdEmbed = discord.createEmbed();
        gdEmbed
        .setAuthor("geometry dash", "https://tchol.org/images/geometry-dash-png-7.png")
        .setTitle(`**GD Level** ${discord.getEmoji("raphi")}`)
        .setDescription(
            `${discord.getEmoji("star")}_Name:_ **${level.name}**\n` +
            `${discord.getEmoji("star")}_Creator:_ **${user ? user.nick : "Not Found"}**\n` +
            `${discord.getEmoji("star")}_Level ID:_ **${level.levelID}**\n` +
            `${discord.getEmoji("star")}_Song ID:_ **${level.songID}**\n` +
            `${discord.getEmoji("star")}_Difficulty:_ **${level.diff}**\n` +
            `${discord.getEmoji("star")}_Stars:_ **${level.stars}**\n` +
            `${discord.getEmoji("star")}_Downloads:_ **${level.downloads}**\n` +
            `${discord.getEmoji("star")}_Likes:_ **${level.likes}**\n` +
            `${discord.getEmoji("star")}_Password:_ **${level.password ? level.password : "None"}**\n` +
            `${discord.getEmoji("star")}_Description:_ ${base64.decode(level.desc)}\n`
        )
        message.channel.send(gdEmbed);
        return;
    }

    if (args[1] === "weekly") {
        const level = await api.levels.getWeekly();
        let user = await api.users.getById(level.creatorUserID);
        let gdEmbed = discord.createEmbed();
        gdEmbed
        .setAuthor("geometry dash", "https://tchol.org/images/geometry-dash-png-7.png")
        .setTitle(`**GD Level** ${discord.getEmoji("raphi")}`)
        .setDescription(
            `${discord.getEmoji("star")}_Name:_ **${level.name}**\n` +
            `${discord.getEmoji("star")}_Creator:_ **${user ? user.nick : "Not Found"}**\n` +
            `${discord.getEmoji("star")}_Level ID:_ **${level.levelID}**\n` +
            `${discord.getEmoji("star")}_Song ID:_ **${level.songID}**\n` +
            `${discord.getEmoji("star")}_Difficulty:_ **${level.diff}**\n` +
            `${discord.getEmoji("star")}_Stars:_ **${level.stars}**\n` +
            `${discord.getEmoji("star")}_Downloads:_ **${level.downloads}**\n` +
            `${discord.getEmoji("star")}_Likes:_ **${level.likes}**\n` +
            `${discord.getEmoji("star")}_Password:_ **${level.password ? level.password : "None"}**\n` +
            `${discord.getEmoji("star")}_Description:_ ${base64.decode(level.desc)}\n`
        )
        message.channel.send(gdEmbed);
        return;
    }

    if (args[1] === "top") {
        let topArray: any = [];
        let users;
        if (args[2] === "100") {
            users = await api.tops.get({type: "top", count: 100});
        } else if (args[2] === "friends") {
            users = await api.tops.get({type: "friends", count: 100});
        } else if (args[2] === "global") {
            users = await api.tops.get({type: "relative", count: 100});
        } else if (args[2] === "creators") {
            users = await api.tops.get({type: "creators", count: 100});
        }
        for (let i = 0; i < users.length; i++) {
            let topEmbed = discord.createEmbed();
            topEmbed
            .setAuthor("geometry dash", "https://tchol.org/images/geometry-dash-png-7.png")
            .setTitle(`**GD Leaderboard** ${discord.getEmoji("raphi")}`)
            .setDescription(
                `${discord.getEmoji("star")}_Rank:_ **${users[i].top}**\n` +
                `${discord.getEmoji("star")}_User:_ **${users[i].nick}**\n` +
                `${discord.getEmoji("star")}_User ID:_ **${users[i].userID}**\n` +
                `${discord.getEmoji("star")}_Account ID:_ **${users[i].accountID}**\n`
            )
            topArray.push(topEmbed);
        }
        discord.createReactionEmbed(topArray);
        return;
    }

    let query = discord.combineArgs(args, 1);

    if (query.match(/\d+/g)) { 
        const level = await api.levels.getById({levelID: query.trim()});
        const user = await api.users.getById(level.creatorUserID);
        console.log(level.creatorUserID)
        console.log(user)
        let gdLevel = await gd.getLevelInfo(query.trim());
        console.log(level)
        console.log(gdLevel)
        return;
    }

    const result = await api.levels.find({query: query.trim()});
    let gdArray: any = [];
    for (let i = 0; i < result.levels.length; i++) {
        let level = await api.levels.getById({levelID: result.levels[i].levelID});
        let user = await api.users.getById(result.levels[i].creatorUserID);
        let gdEmbed = discord.createEmbed();
        gdEmbed
        .setAuthor("geometry dash", "https://tchol.org/images/geometry-dash-png-7.png")
        .setTitle(`**GD Level** ${discord.getEmoji("raphi")}`)
        .setDescription(
            `${discord.getEmoji("star")}_Name:_ **${level.name}**\n` +
            `${discord.getEmoji("star")}_Creator:_ **${user ? user.nick : "Not Found"}**\n` +
            `${discord.getEmoji("star")}_Level ID:_ **${level.levelID}**\n` +
            `${discord.getEmoji("star")}_Song ID:_ **${level.songID}**\n` +
            `${discord.getEmoji("star")}_Difficulty:_ **${level.diff}**\n` +
            `${discord.getEmoji("star")}_Stars:_ **${level.stars}**\n` +
            `${discord.getEmoji("star")}_Downloads:_ **${level.downloads}**\n` +
            `${discord.getEmoji("star")}_Likes:_ **${level.likes}**\n` +
            `${discord.getEmoji("star")}_Password:_ **${level.password ? level.password : "None"}**\n` +
            `${discord.getEmoji("star")}_Description:_ ${base64.decode(level.desc)}\n`

        )
        gdArray.push(gdEmbed);
    }
    discord.createReactionEmbed(gdArray);
}