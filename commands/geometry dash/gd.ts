exports.run = async (client: any, message: any, args: string[]) => {
    const GDClient = require('geometry-dash-api');
    const gd = require("gdprofiles");

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
        const daily = await api.levels.getDaily();
        console.log(daily)
    }

    if (args[1] === "weekly") {
        const weekly = await api.levels.getWeekly();
        console.log(weekly)
    }

    if (args[1] === "top") {
        if (args[2] === "100") {
            const users = await api.tops.get({type: "top", count: 100});
            console.log(users); 
        } else if (args[2] === "friends") {
            const users = await api.tops.get({type: "friends", count: 100});
            console.log(users); 
        } else if (args[2] === "global") {
            const users = await api.tops.get({type: "relative", count: 100});
            console.log(users); 
        } else if (args[2] === "creators") {
            const users = await api.tops.get({type: "creators", count: 100});
            console.log(users); 
        }
    }

    let query = client.combineArgs(args, 1);

    if (query.match(/\d+/g)) { 
        const level = await api.levels.getById({levelID: query.trim()});
        const user = await api.users.getById(level.creatorUserID);
        console.log(level.creatorUserID)
        console.log(user)
        let gdLevel = await gd.getLevelInfo(query.trim(), "KingDLetsPlay");
        console.log(level)
        console.log(gdLevel)
        return;
    }

    const result = await api.levels.find({query: query.trim()});
    console.log(result)
}