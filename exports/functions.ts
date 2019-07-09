import {Client, Message} from "discord.js";

module.exports = async (client: Client, message: Message) => {

    let ownerID: any = process.env.OWNER_ID;
    let Discord: any = require("discord.js");
    let config: any = require("../../config.json");
    let queries: any = await require("./queries.js"); 
    let prefix: string = await queries.fetchPrefix();
    let colors: string[] = config.colors;
    
    //Random Number
    exports.getRandomNum = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
    }

    //Response Time
    exports.responseTime = () => {
        return `${Date.now() - message.createdTimestamp} ms`;
    }

    //Get Emoji
    exports.getEmoji = (name: string) => {
        for (let i in config.emojis) {
            if (name === config.emojis[i].name) {
                return client.emojis.find((emoji: any) => emoji.id === config.emojis[i].id);
            }
        }
    }

    //Random Color
    exports.randomColor = () => {
        return parseInt(colors[Math.floor(Math.random() * colors.length)]);
    }

    //Create Embed
    exports.createEmbed = () => {
        let embed: any = new Discord.RichEmbed();
            embed
            .setColor(exports.randomColor())
            .setTimestamp(embed.timestamp)
            .setFooter(`Responded in ${exports.responseTime()}`, message.author.avatarURL);
            return embed;
    }

    //Check for Bot Owner
    exports.checkBotOwner = () => {
        if (message.author.id === ownerID) {
            return true;
        } else {
            return false;
        }
    }

    //Create Permission
    exports.createPermission = (permission: string) => {
        let perm: any = new Discord.Permissions(permission);
        return perm;
    }

    //Check for Bot Mention
    exports.checkBotMention = (message: any) => {
        if (message.content.startsWith("<@!593838271650332672>")) {
            return true;
        }
    }

    //Check for Prefix and User
    exports.checkPrefixUser = (message: any) => {
        if(!message.content.startsWith(prefix) || message.author.bot) {
            return true;
        }
    }

    //Combine args after an index
    exports.combineArgs = (args: string[], num: number) => {
        let combined: string = "";
        for (let i = num; i < args.length; i++) {
            combined += args[i] + " ";
        }
        return combined;
    }

    //Check args
    exports.checkArgs = (args: string[], num: string) => {
        switch (num) {
            case "single": {
                if (!args[0]) {
                    return false;
                } else {
                    return true;
                }

            }
            case "multi": {
                if (!args[0] || !exports.combineArgs(args, 1)) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    }

    //Calculate Score
    exports.calcScore = async () => {
        let rawScoreList: string[] = await queries.fetchColumn("points", "score list");
        let rawLevelList: string[] = await queries.fetchColumn("points", "level list");
        let rawPointRange: string[] = await queries.fetchColumn("points", "point range");
        let rawPointThreshold: string[] = await queries.fetchColumn("points", "point threshold");
        let rawUserList: string[] = await queries.fetchColumn("points", "user id list");
        let levelUpMessage: string = await queries.fetchColumn("points", "level message");

        let scoreList: number[] = rawScoreList.map((num: string) => Number(num));
        let levelList: number[] = rawLevelList.map((num: string) => Number(num));
        let pointRange: number[] = rawPointRange.map((num: string) => Number(num));
        let pointThreshold: number = Number(rawPointThreshold);
        let userList: number[] = rawUserList.map((num: string) => Number(num));
        let userStr: string = levelUpMessage.toString().replace("user", `<@${message.author.id}>`)
        

        for (let i: number = 0; i < userList.length; i++) {
            if (userList[i] === Number(message.author.id)) {
                let userScore: number = scoreList[i];
                let userLevel: number = levelList[i];
                let newPoints: number = Math.floor(userScore + exports.getRandomNum(pointRange[0], pointRange[1]));
                let newLevel: number = Math.floor(userScore / pointThreshold);
                let lvlStr: string = userStr.replace("newlevel", newLevel.toString());

                if (newLevel > userLevel) {
                    levelList[i] = newLevel;
                    await queries.updateColumn("points", "level list", levelList);
                    const levelEmbed = exports.createEmbed();
                    levelEmbed
                    .setDescription(lvlStr);
                    queries.message.channel.send(levelEmbed);
                }
                scoreList[i] = newPoints;
                await queries.updateColumn("points", "score list", scoreList);
            }
        }
      }
}