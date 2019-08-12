exports.run = async (client: any, message: any, args: string[]) => {
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
        let nick = client.combineArgs(args, 2);
        let user = await api.users.getByNick(nick);
        let gdUser = await gd.search(nick);
        console.log(gdUser)
        let levelArray: any = [];
        for (let i in gdUser.lastLevels) {
            levelArray.push(gdUser.lastLevels[i].name)
        }
        let gdEmbed = client.createEmbed();
        gdEmbed
        .setAuthor("geometry dash", "https://tchol.org/images/geometry-dash-png-7.png")
        .setTitle(`**GD Profile** ${client.getEmoji("raphi")}`)
        .setURL(`https://gdprofiles.com/${user.nick}`)
        .setDescription(
            `${client.getEmoji("star")}${client.getEmoji("gdStar")} **${user.stars}** ` +
            `${client.getEmoji("gdDiamond")} **${user.diamonds}** ` +
            `${client.getEmoji("gdCoin")} **${user.coins}** ` +
            `${client.getEmoji("gdUserCoin")} **${user.userCoins}** ` +
            `${client.getEmoji("gdDemon")} **${user.demons}** ` +
            `${client.getEmoji("gdCP")} **${user.creatorPoints}** \n` + 
            `${client.getEmoji("star")}_Name:_ **${user.nick}**\n` +
            `${client.getEmoji("star")}_Rank:_ **#${user.top}**\n` +
            `${client.getEmoji("star")}_User ID:_ **${user.userID}**\n` +
            `${client.getEmoji("star")}_Account ID:_ **${user.accountID}**\n` +
            `${client.getEmoji("star")}_Account Type:_ **${user.rightsString}**\n` +
            `${client.getEmoji("star")}_Youtube:_ **${user.youtube}**\n` +
            `${client.getEmoji("star")}_Twitter:_ **${user.twitter}**\n` +
            `${client.getEmoji("star")}_Twitch:_ **${user.twitch}**\n` +
            `${client.getEmoji("star")}_Description:_ ${gdUser.desc ? gdUser.desc : "None"}\n` +
            `${client.getEmoji("star")}_Levels:_ ${levelArray.join("") ? levelArray.join(",     ") : "None"}\n` 
        )
        .setImage(`https://img.youtube.com/vi/${gdUser.video.embed.replace(/www.youtube.com\/embed\//g, "")}/maxresdefault.jpg`)
        .setThumbnail(gdUser.img.player)
        message.channel.send(gdEmbed);
        return;
    }

    if (args[1] === "daily") {
        const level = await api.levels.getDaily();
        let user = await api.users.getById(level.creatorUserID);
        let gdEmbed = client.createEmbed();
        gdEmbed
        .setAuthor("geometry dash", "https://tchol.org/images/geometry-dash-png-7.png")
        .setTitle(`**GD Level** ${client.getEmoji("raphi")}`)
        .setDescription(
            `${client.getEmoji("star")}_Name:_ **${level.name}**\n` +
            `${client.getEmoji("star")}_Creator:_ **${user ? user.nick : "Not Found"}**\n` +
            `${client.getEmoji("star")}_Level ID:_ **${level.levelID}**\n` +
            `${client.getEmoji("star")}_Song ID:_ **${level.songID}**\n` +
            `${client.getEmoji("star")}_Difficulty:_ **${level.diff}**\n` +
            `${client.getEmoji("star")}_Stars:_ **${level.stars}**\n` +
            `${client.getEmoji("star")}_Downloads:_ **${level.downloads}**\n` +
            `${client.getEmoji("star")}_Likes:_ **${level.likes}**\n` +
            `${client.getEmoji("star")}_Password:_ **${level.password ? level.password : "None"}**\n` +
            `${client.getEmoji("star")}_Description:_ ${base64.decode(level.desc)}\n`
        )
        message.channel.send(gdEmbed);
        return;
    }

    if (args[1] === "weekly") {
        const level = await api.levels.getWeekly();
        let user = await api.users.getById(level.creatorUserID);
        let gdEmbed = client.createEmbed();
        gdEmbed
        .setAuthor("geometry dash", "https://tchol.org/images/geometry-dash-png-7.png")
        .setTitle(`**GD Level** ${client.getEmoji("raphi")}`)
        .setDescription(
            `${client.getEmoji("star")}_Name:_ **${level.name}**\n` +
            `${client.getEmoji("star")}_Creator:_ **${user ? user.nick : "Not Found"}**\n` +
            `${client.getEmoji("star")}_Level ID:_ **${level.levelID}**\n` +
            `${client.getEmoji("star")}_Song ID:_ **${level.songID}**\n` +
            `${client.getEmoji("star")}_Difficulty:_ **${level.diff}**\n` +
            `${client.getEmoji("star")}_Stars:_ **${level.stars}**\n` +
            `${client.getEmoji("star")}_Downloads:_ **${level.downloads}**\n` +
            `${client.getEmoji("star")}_Likes:_ **${level.likes}**\n` +
            `${client.getEmoji("star")}_Password:_ **${level.password ? level.password : "None"}**\n` +
            `${client.getEmoji("star")}_Description:_ ${base64.decode(level.desc)}\n`
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
            let topEmbed = client.createEmbed();
            topEmbed
            .setAuthor("geometry dash", "https://tchol.org/images/geometry-dash-png-7.png")
            .setTitle(`**GD Leaderboard** ${client.getEmoji("raphi")}`)
            .setDescription(
                `${client.getEmoji("star")}_Rank:_ **${users[i].top}**\n` +
                `${client.getEmoji("star")}_User:_ **${users[i].nick}**\n` +
                `${client.getEmoji("star")}_User ID:_ **${users[i].userID}**\n` +
                `${client.getEmoji("star")}_Account ID:_ **${users[i].accountID}**\n`
            )
            topArray.push(topEmbed);
        }
        client.createReactionEmbed(topArray);
        return;
    }

    let query = client.combineArgs(args, 1);

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
        let gdEmbed = client.createEmbed();
        gdEmbed
        .setAuthor("geometry dash", "https://tchol.org/images/geometry-dash-png-7.png")
        .setTitle(`**GD Level** ${client.getEmoji("raphi")}`)
        .setDescription(
            `${client.getEmoji("star")}_Name:_ **${level.name}**\n` +
            `${client.getEmoji("star")}_Creator:_ **${user ? user.nick : "Not Found"}**\n` +
            `${client.getEmoji("star")}_Level ID:_ **${level.levelID}**\n` +
            `${client.getEmoji("star")}_Song ID:_ **${level.songID}**\n` +
            `${client.getEmoji("star")}_Difficulty:_ **${level.diff}**\n` +
            `${client.getEmoji("star")}_Stars:_ **${level.stars}**\n` +
            `${client.getEmoji("star")}_Downloads:_ **${level.downloads}**\n` +
            `${client.getEmoji("star")}_Likes:_ **${level.likes}**\n` +
            `${client.getEmoji("star")}_Password:_ **${level.password ? level.password : "None"}**\n` +
            `${client.getEmoji("star")}_Description:_ ${base64.decode(level.desc)}\n`

        )
        gdArray.push(gdEmbed);
    }
    client.createReactionEmbed(gdArray);
}