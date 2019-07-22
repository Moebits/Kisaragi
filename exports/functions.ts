module.exports = async (client: any, message: any) => {

    let Discord: any = require("discord.js");
    let config: any = require("../../config.json");
    let prefix: string = await client.fetchPrefix();
    let colors: string[] = config.colors;
    let letters: any = require("../../letters.json");
    const child_process = require('child_process');

    //Execute File
    client.execFile = async (file: string, args?: string[]) => {
        await child_process.execFile(`../assets/tools/${file}`, args);
        return console.log("finished");
    }
    
    //Random Number
    client.getRandomNum = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
    }

    //Response Time
    client.responseTime = () => {
        return `${Date.now() - message.createdTimestamp} ms`;
    }

    //Format Date
    client.formatDate = (inputDate: Date) => {
        let monthNames = [
          "January", "February", "March",
          "April", "May", "June", "July",
          "August", "September", "October",
          "November", "December"
        ];
        let date = new Date(inputDate);
        let day = date.getDate();
        let monthIndex = date.getMonth();
        let year = date.getFullYear();
      
        return `${monthNames[monthIndex]} ${day}, ${year}`;
      }

    //Check Message Characters
    client.checkChar = (message: any, num: number, char: string) => {
        let splitText;
        if (message.length > 1024) {
            splitText = Discord.Util.splitMessage(message, {"maxLength": num, "char": char})
        }
        if (splitText) {
            return splitText[0];
        } else {
            return message;
        }
    }

    //Parse Letters
    client.letters = (text: string) => {
        let fullText: string[] = [];
        for (let i = 0; i < text.length; i++) {
            fullText.push(client.getLetter(text[i]));
        }
        let fullString = fullText.join("");
        return client.checkChar(fullString, 1999, "<");
    }


    //Parse Emoji Letters
    client.getLetter = (letter: string) => {
        if (letter === " ") return "     ";
        if (letter === letter.toUpperCase()) {
            for (let i in letters.letters) {
                if (letters.letters[i].name === `${letter}U`) {
                    let found = client.emojis.find((emoji: any) => emoji.id === letters.letters[i].id)
                    return `<:${found.identifier}>`
                }
            }
            return letter;
        }
        if (letter === letter.toLowerCase()) {
            for (let i in letters.letters) {
                if (letters.letters[i].name === `${letter}l`) {
                    let found = client.emojis.find((emoji: any) => emoji.id === letters.letters[i].id)
                    return `<:${found.identifier}>`
                }
            }
            return letter;
        }
        if (typeof Number(letter) === "number") {
            for (let i in letters.letters) {
                if (letters.letters[i].name === `${letter}n`) {
                    let found = client.emojis.find((emoji: any) => emoji.id === letters.letters[i].id)
                    return `<:${found.identifier}>`
                }
            }
            return letter;
        }
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

    //Check args
    client.checkArgs = (args: string[], num: string) => {
        switch (num) {
            case "single": {
                if (!args[0]) {
                    return false;
                } else {
                    return true;
                }

            }
            case "multi": {
                if (!args[0] || !client.combineArgs(args, 1)) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    }

    //Errors
    client.cmdError = (error: any) => {
        console.log(error);
        let messageErrorEmbed = client.createEmbed();
        messageErrorEmbed
        .setTitle(`**Command Error** ${client.getEmoji("maikaWut")}`)
        .setDescription(`There was an error executing this command:\n` + 
        `**${error.name}: ${error.message}**\n` + `Please report this through the following links:\n` +
        `[Official Server](https://discord.gg/77yGmWM), [Github Repo](https://github.com/Tenpi/Gab)`);
        return messageErrorEmbed;
    }

    //Fetch Score
    client.fetchScore = async () => {
        let rawScoreList: string[] = await client.fetchColumn("points", "score list");
        let rawUserList: string[] = await client.fetchColumn("points", "user id list");
        let scoreList: number[] = rawScoreList.map((num: string) => Number(num));
        let userList: number[] = rawUserList.map((num: string) => Number(num));
        for (let i: number = 0; i < userList.length; i++) {
            if (userList[i] === Number(message.author.id)) {
                let userScore: number = scoreList[i];
                return userScore; 
            }
        }
    }

    //Fetch Level
    client.fetchLevel = async () => {
        let rawLevelList: string[] = await client.fetchColumn("points", "level list");
        let rawUserList: string[] = await client.fetchColumn("points", "user id list");
        let levelList: number[] = rawLevelList.map((num: string) => Number(num));
        let userList: number[] = rawUserList.map((num: string) => Number(num));
        for (let i: number = 0; i < userList.length; i++) {
            if (userList[i] === Number(message.author.id)) {
                let userLevel: number = levelList[i];
                return userLevel; 
            }
        }
    }

    //Calculate Score
    client.calcScore = async () => {
        let rawScoreList: string[] = await client.fetchColumn("points", "score list");
        let rawLevelList: string[] = await client.fetchColumn("points", "level list");
        let rawPointRange: string[] = await client.fetchColumn("points", "point range");
        let rawPointThreshold: string[] = await client.fetchColumn("points", "point threshold");
        let rawUserList: string[] = await client.fetchColumn("points", "user id list");
        let levelUpMessage: string = await client.fetchColumn("points", "level message");

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
                if (userScore === null) {
                    scoreList[i] = 0;
                    await client.updateColumn("points", "score list", scoreList);
                    return;
                }
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