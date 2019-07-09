module.exports = async (client: any, message: any) => {

    let ownerID: any = process.env.OWNER_ID;
    let Discord: any = require("discord.js");
    let config: any = require("../../config.json");
    let prefix: string = await client.fetchPrefix();
    let colors: string[] = config.colors;
    
    //Random Number
    client.getRandomNum = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
    }

    //Response Time
    client.responseTime = () => {
        return `${Date.now() - message.createdTimestamp} ms`;
    }

    //Get Emoji
    client.getEmoji = (name: string) => {
        for (let i in config.emojis) {
            if (name === config.emojis[i].name) {
                return client.emojis.find((emoji: any) => emoji.id === config.emojis[i].id);
            }
        }
    }

    //Random Color
    client.randomColor = () => {
        return parseInt(colors[Math.floor(Math.random() * colors.length)]);
    }

    //Create Embed
    client.createEmbed = () => {
        let embed: any = new Discord.RichEmbed();
            embed
            .setColor(client.randomColor())
            .setTimestamp(embed.timestamp)
            .setFooter(`Responded in ${client.responseTime()}`, message.author.avatarURL);
            return embed;
    }

    //Check for Bot Owner
    client.checkBotOwner = () => {
        if (message.author.id === ownerID) {
            return true;
        } else {
            return false;
        }
    }

    //Create Permission
    client.createPermission = (permission: string) => {
        let perm: any = new Discord.Permissions(permission);
        return perm;
    }

    //Check for Bot Mention
    client.checkBotMention = (message: any) => {
        if (message.content.startsWith("<@!593838271650332672>")) {
            return true;
        }
    }

    //Check for Prefix and User
    client.checkPrefixUser = (message: any) => {
        if(!message.content.startsWith(prefix) || message.author.bot) {
            return true;
        }
    }

    //Combine args after an index
    client.combineArgs = (args: string[], num: number) => {
        let combined: string = "";
        for (let i = num; i < args.length; i++) {
            combined += args[i] + " ";
        }
        return combined;
    }

    //Calculate Score
    client.calcScore = async () => {
        let rawScoreList: any = await client.fetchColumn("points", "score list");
        let rawLevelList: any = await client.fetchColumn("points", "level list");
        let rawPointRange: any = await client.fetchColumn("points", "point range");
        let rawPointThreshold: any = await client.fetchColumn("points", "point threshold");
        let rawUserList: any = await client.fetchColumn("points", "user id list");
        let levelUpMessage: any = await client.fetchColumn("points", "level message");

        let scoreList: number[] = rawScoreList.map((num: any) => parseInt(num));
        let levelList: number[] = rawLevelList.map((num: any) => parseInt(num));
        let pointRange: number[] = rawPointRange.map((num: any) => parseInt(num));
        let pointThreshold: number = parseInt(rawPointThreshold);
        let userList: number[] = rawUserList.map((num: any) => parseInt(num));
        let userStr: string = levelUpMessage.toString().replace("user", `<@${message.author.id}>`)
        

        for (let i in userList) {
            if (userList[i] === message.author.id) {
                let userScore: number = scoreList[i];
                let userLevel: number = levelList[i];
                let newPoints: number = Math.floor(userScore + client.getRandomNum(pointRange[0], pointRange[1]));
                let newLevel: number = Math.floor(userScore / pointThreshold);
                let lvlStr: string = userStr.replace("newlevel", newLevel.toString());

                if (newLevel > userLevel) {
                    levelList[i] = newLevel;
                    await client.updateColumn("points", "level list", levelList);
                    const levelEmbed = client.createEmbed();
                    levelEmbed
                    .setDescription(lvlStr);
                    client.message.channel.send(levelEmbed);
                }
                scoreList[i] = newPoints;
                await client.updateColumn("points", "score list", scoreList);
            }
        }
      }
}