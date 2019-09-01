module.exports = async (discord: any, message: any) => {

    let Discord: any = require("discord.js");
    let config: any = require("../../config.json");
    let colors: string[] = config.colors;
    let letters: any = require("../../letters.json");
    const child_process = require('child_process');

    //Run Command 
    discord.runCommand = async (msg: any, args: string[]) => {
        args = args.filter(Boolean);
        let path = await discord.fetchCommand(args[0], "path");
        let cp = require(`${path[0]}`);
        await cp.run(discord, msg, args).catch((err) => msg.channel.send(discord.cmdError(err)));
    }

    //Auto Command
    discord.autoCommand = async (msg: any) => {
        let command = await discord.fetchColumn("auto", "command");
        let channel = await discord.fetchColumn("auto", "channel");
        let frequency = await discord.fetchColumn("auto", "frequency");
        let toggle = await discord.fetchColumn("auto", "toggle");
        if (!command[0]) return;
        for (let i = 0; i < command[0].length; i++) {
            if (toggle[0][i] === "inactive") continue;
            let guildChannel = msg.guild.channels.find((c: any) => c.id === channel[0][i]);
            let cmd = command[0][i].split(" ");
            let timeout = Number(frequency[0][i]) * 3600000;
            let rawTimeLeft = await discord.fetchColumn("auto", "timeout");
            let timeLeft;
            if (rawTimeLeft[0]) {
                timeLeft = Number(rawTimeLeft[0][i]) || 0;
            } else {
                timeLeft = 0;
            }
            console.log(timeLeft)
            console.log(timeout - timeLeft*1000)
            let last = await guildChannel.fetchMessages({limit: 1});
            let guildMsg = await last.first();
            let interval = setInterval(async () => {
                discord.runCommand(guildMsg, cmd);
            }, timeout - (timeLeft * 1000));
            discord.timeLeft(interval, i);
        }
    }

    //Time left
    discord.timeLeft = async (timeout, i) => {
        setInterval(async function() {
            let times = await discord.fetchColumn("auto", "timeout");
            if (!times[0]) times[0] = [[0]];
            times[0][i] = getTimeLeft(timeout);
            console.log('Time left: '+getTimeLeft(timeout)+'s')
            await discord.updateColumn("auto", "timeout", times[0]);
        }, 10000);
        function getTimeLeft(timeout) {
            console.log(((timeout._idleStart + timeout._idleTimeout) * 1000) - (Date.now() / 1000))
            return Math.ceil((((timeout._idleStart + timeout._idleTimeout) * 1000) - (Date.now() / 1000)) / 1000);
        }
    }

    //Haiku
    discord.haiku = async (msg: any) => {
        const syllable = require("syllable");
        let wordArray = msg.content.replace(/\s+/g, " ").split(" ");
        let lineCount1 = 0;
        let lineCount2 = 0;
        let lineCount3 = 0;
        let line1: string[] = [];
        let line2: string[] = [];
        let line3: string[] = [];
        for (let i = 0; i < wordArray.length; i++) {
            if (lineCount1 !== 5) {
                lineCount1 += syllable(wordArray[i]);   
                line1.push(wordArray[i])
                continue;
            }
            if (lineCount1 === 5 && lineCount2 !== 7) {
                lineCount2 += syllable(wordArray[i]);
                line2.push(wordArray[i]);
                continue;
            }
            if (lineCount2 === 7) {
                lineCount3 += syllable(wordArray[i]);
                line3.push(wordArray[i]);
            }
        }

        if (lineCount3 === 5) {
            let haikuEmbed = discord.createEmbed();
            haikuEmbed
            .setTitle(`**Haiku** ${discord.getEmoji("vigneXD")}`)
            .setThumbnail(msg.author.displayAvatarURL)
            .setDescription(
                `${line1.join(" ")}\n` +
                `${line2.join(" ")}\n` +
                `${line3.join(" ")}\n` +
                "\n" +
                `**- ${msg.author.username}**\n` 
            )
            msg.channel.send(haikuEmbed);
        }

    }

    //Blocked Word
    discord.block = async (msg: any) => {
        if (msg.author.bot) return;
        let words = await discord.fetchColumn("blocks", "blocked words");
        if (!words[0]) return;
        let wordList = words[0];
        wordList.forEach((w: any) => w.replace(/0/gi, "o").replace(/1/gi, "l").replace(/!/gi, "l").replace(/\*/gi, "u"));
        let match = await discord.fetchColumn("blocks", "block match");
        if (match[0] === "exact") {
            if (wordList.some((w: any) => w.includes(msg.content))) {
                let reply = await msg.reply("Your post was removed because it contained a blocked word.")
                await msg.delete();
                reply.delete(10000);
            }
        } else {
            for (let i = 0; i < wordList.length; i++) {
                if (msg.content.includes(wordList[i])) {
                    let reply = await msg.reply("Your post was removed because it contained a blocked word.")
                    await msg.delete();
                    reply.delete(10000);
                }
            }
        }
    }

    //Check Mod
    discord.checkMod = async (msg: any) => {
        let mod = await discord.fetchColumn("special roles", "mod role");
        if (!mod.join("")) {
            msg.reply("In order to use moderator commands, you must first " +
            "configure the server's moderator role using the **mod** command!");
            return true;
        } else {
            let modRole = await msg.member.roles.find((r: any) => r.id === mod.join("").trim());
            if (!modRole) {
                msg.reply("In order to use moderator commands, you must have " +
                `the mod role which is currently set to <@&${mod.join("").trim()}>!`);
                return true;
            }
        }
        return false;
    }

    //Check Admin
    discord.checkAdmin = async (msg: any) => {
        let admin = await discord.fetchColumn("special roles", "admin role");
        if (!admin.join("")) {
            msg.reply("In order to use administrator commands, you must first " +
            "configure the server's administrator role using the **mod** command!");
            return true;
        } else {
            let adminRole = await msg.member.roles.find((r: any) => r.id === admin.join("").trim());
            if (!adminRole) {
                msg.reply("In order to use administrator commands, you must have " +
                `the admin role which is currently set to <@&${admin.join("").trim()}>!`);
                return true;
            }
        }
        return false;
    }

    //Check Bot Dev
    discord.checkBotDev = (msg: any) => {
        if (msg.author.id === process.env.OWNER_ID) {
            return false;
        } else {
            msg.reply("Only the bot developer can use bot developer commands");
            return true;
        }
    }
    
    //Timeout
    discord.timeout = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    //Await Pipe
    discord.awaitPipe = async (readStream, writeStream) => {
        return new Promise(resolve => {
            readStream.pipe(writeStream);
            readStream.on("end", async () => {
                resolve();
            });
        });
    }

    //Execute File
    discord.execFile = async (file: string, args?: string[]) => {
        await child_process.execFile(`../assets/tools/${file}`, args);
        return console.log("finished");
    }
    
    //Random Number
    discord.getRandomNum = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
    }

    //Response Time
    discord.responseTime = () => {
        return `${Date.now() - message.createdTimestamp} ms`;
    }

    //Command Cooldown
    discord.cmdCooldown = (cmd: string, cooldown: string, msg: any, cooldowns: any) => {
        if (!cooldowns.has(cmd)) {
            cooldowns.set(cmd, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(cmd);
        const cooldownAmount = (Number(cooldown) || 3) * 1000;

        if (timestamps.has(msg.guild.id)) {
            const expirationTime = timestamps.get(msg.guild.id) + cooldownAmount;
        
            if (now < expirationTime) {
                let cooldownEmbed = discord.createEmbed();
                const timeLeft = (expirationTime - now) / 1000;
                cooldownEmbed
                .setTitle(`**Command Cooldown!** ${discord.getEmoji("kannaHungry")}`)
                .setDescription(`${discord.getEmoji("star")}**${cmd}** is on cooldown! Wait **${timeLeft.toFixed(2)}** more seconds before trying again.`);
                return cooldownEmbed;
            }
        }
        timestamps.set(msg.guild.id, now);
        setTimeout(() => {timestamps.delete(msg.guild.id)}, cooldownAmount)
        return null;
    }

    //Format Date
    discord.formatDate = (inputDate: Date) => {
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

    //Proper Case
    discord.toProperCase = (str) => {
        return str.replace(
            /\w\S*/g,
            function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

    //Check Message Characters
    discord.checkChar = (message: any, num: number, char: string) => {
        let splitText;
        if (message.length > num) {
            splitText = Discord.Util.splitMessage(message, {"maxLength": num, "char": char})
        }
        if (splitText) {
            return splitText[0];
        } else {
            return message;
        }
    }

    //Parse Letters
    discord.letters = (text: string) => {
        let fullText: string[] = [];
        for (let i = 0; i < text.length; i++) {
            fullText.push(discord.getLetter(text[i]));
        }
        let fullString = fullText.join("");
        return discord.checkChar(fullString, 1999, "<");
    }


    //Parse Emoji Letters
    discord.getLetter = (letter: string) => {
        if (letter === " ") return "     ";
        if (letter === letter.toUpperCase()) {
            for (let i in letters.letters) {
                if (letters.letters[i].name === `${letter}U`) {
                    let found = discord.emojis.find((emoji: any) => emoji.id === letters.letters[i].id)
                    return `<:${found.identifier}>`
                }
            }
            return letter;
        }
        if (letter === letter.toLowerCase()) {
            for (let i in letters.letters) {
                if (letters.letters[i].name === `${letter}l`) {
                    let found = discord.emojis.find((emoji: any) => emoji.id === letters.letters[i].id)
                    return `<:${found.identifier}>`
                }
            }
            return letter;
        }
        if (typeof Number(letter) === "number") {
            for (let i in letters.letters) {
                if (letters.letters[i].name === `${letter}n`) {
                    let found = discord.emojis.find((emoji: any) => emoji.id === letters.letters[i].id)
                    return `<:${found.identifier}>`
                }
            }
            return letter;
        }
    }

    //Get Emoji
    discord.getEmoji = (name: string) => {
        for (let i in config.emojis) {
            if (name === config.emojis[i].name) {
                return discord.emojis.find((emoji: any) => emoji.id === config.emojis[i].id);
            }
        }
    }

    //Remove from Array
    discord.arrayRemove = (arr: any, val: any) => {
        for (let i = 0; i < arr.length; i++) { 
            if (arr[i] === val) {
              arr.splice(i, 1); 
              i--;
            }
         }
    }

    //Random Color
    discord.randomColor = () => {
        return parseInt(colors[Math.floor(Math.random() * colors.length)]);
    }

    //Create Embed
    discord.createEmbed = () => {
        let embed: any = new Discord.RichEmbed();
            embed
            .setColor(discord.randomColor())
            .setTimestamp(embed.timestamp)
            .setFooter(`Responded in ${discord.responseTime()}`, discord.user.displayAvatarURL);
            return embed;
    }

    //Create Permission
    discord.createPermission = (permission: string) => {
        let perm: any = new Discord.Permissions(permission);
        return perm;
    }

    //Check for Bot Mention
    discord.checkBotMention = (message: any) => {
        if (message.content.startsWith("<@!593838271650332672>")) {
            return true;
        }
    }

    //Combine args after an index
    discord.combineArgs = (args: string[], num: number) => {
        let combined: string = "";
        for (let i = num; i < args.length; i++) {
            combined += args[i] + " ";
        }
        return combined;
    }

    //Check args
    discord.checkArgs = (args: string[], num: string) => {
        switch (num) {
            case "single": {
                if (!args[0]) {
                    return false;
                } else {
                    return true;
                }

            }
            case "multi": {
                if (!args[0] || !discord.combineArgs(args, 1)) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    }

    //Errors
    discord.cmdError = (error: any) => {
        console.log(error);
        let messageErrorEmbed = discord.createEmbed();
        messageErrorEmbed
        .setTitle(`**Command Error** ${discord.getEmoji("maikaWut")}`)
        .setDescription(`There was an error executing this command:\n` + 
        `**${error.name}: ${error.message}**\n` + `Please report this through the following links:\n` +
        `[Official Server](https://discord.gg/77yGmWM), [Github Repo](https://github.com/Tenpi/Gab)`);
        return messageErrorEmbed;
    }

    //Fetch Score
    discord.fetchScore = async (msg: any) => {
        let rawScoreList: string[][] = await discord.fetchColumn("points", "score list");
        let rawUserList: string[][] = await discord.fetchColumn("points", "user id list");
        let scoreList: number[] = rawScoreList[0].map((num: string) => Number(num));
        let userList: number[] = rawUserList[0].map((num: string) => Number(num));
        for (let i: number = 0; i < userList.length; i++) {
            if (userList[i] === Number(msg.author.id)) {
                let userScore: number = scoreList[i];
                return userScore; 
            }
        }
    }

    //Fetch Level
    discord.fetchLevel = async (msg: any) => {
        let rawLevelList: string[][] = await discord.fetchColumn("points", "level list");
        let rawUserList: string[][] = await discord.fetchColumn("points", "user id list");
        let levelList: number[] = rawLevelList[0].map((num: string) => Number(num));
        let userList: number[] = rawUserList[0].map((num: string) => Number(num));
        for (let i: number = 0; i < userList.length; i++) {
            if (userList[i] === Number(msg.author.id)) {
                let userLevel: number = levelList[i];
                return userLevel; 
            }
        }
    }

    //Calculate Score
    discord.calcScore = async (msg: any) => {
        if (message.author.bot) return;
        let rawScoreList: string[][] = await discord.fetchColumn("points", "score list");
        let rawLevelList: string[][] = await discord.fetchColumn("points", "level list");
        let rawPointRange: string[][] = await discord.fetchColumn("points", "point range");
        let rawPointThreshold: string[] = await discord.fetchColumn("points", "point threshold");
        let rawUserList: string[][] = await discord.fetchColumn("points", "user id list");
        let levelUpMessage: string[] = await discord.fetchColumn("points", "level message");
        let userList: number[] = rawUserList[0].map((num: string) => Number(num));

        if (!rawScoreList[0]) {
            let initList: number[] = [];
            for (let i = 0; i < userList.length; i++) {
                initList[i] = 0;
            }
            await discord.updateColumn("points", "score list", initList);
            await discord.updateColumn("points", "level list", initList);
            return;
        }

        let scoreList: number[] = rawScoreList[0].map((num: string) => Number(num))
        let levelList: number[] = rawLevelList[0].map((num: string) => Number(num));
        let pointRange: number[] = rawPointRange[0].map((num: string) => Number(num));
        let pointThreshold: number = Number(rawPointThreshold);
        let userStr: string = levelUpMessage.join("").replace("user", `<@${message.author.id}>`)

        for (let i: number = 0; i < userList.length; i++) {
            if (userList[i] === Number(msg.author.id)) {
                let userScore: number = scoreList[i];
                let userLevel: number = levelList[i];
                if (userScore === undefined || userScore === null) {
                    scoreList[i] = 0;
                    levelList[i] = 0;
                    await discord.updateColumn("points", "score list", scoreList);
                    await discord.updateColumn("points", "score list", levelList);
                    return;
                }
                let newPoints: number = Math.floor(userScore + discord.getRandomNum(pointRange[0], pointRange[1]));
                let newLevel: number = Math.floor(userScore / pointThreshold);
                let lvlStr: string = userStr.replace("newlevel", newLevel.toString());

                if (newLevel > userLevel) {
                    levelList[i] = newLevel;
                    await discord.updateColumn("points", "level list", levelList);
                    let channel = msg.member.lastMessage.channel;
                    const levelEmbed = discord.createEmbed();
                    levelEmbed
                    .setTitle(`**Level Up!** ${discord.getEmoji("vigneXD")}`)
                    .setDescription(lvlStr);
                    channel.send(levelEmbed);
                }

                scoreList[i] = newPoints;
                await discord.updateColumn("points", "score list", scoreList);
                return;
            }
        }
      }

    //Generate Commands for commands.json
    discord.generateCommands = (cmdFiles: any) => {
        let newFiles = cmdFiles.flat()
        console.log(newFiles)
        let addedFiles: any = [];
        loop1:
        for (let i in newFiles) {
            let commandName = newFiles[i].split(".")[0];
            loop2:
            for (let j in addedFiles) {
                if (addedFiles[j] === commandName) {
                    continue loop1;
                }
            }
            addedFiles.push(commandName)
            console.log(`"${commandName}": {"name": "${commandName}", "aliases": [], "cooldown": ""},`);
        }
    }

    //Generate Emojis for config.json
    discord.generateEmojis = (letterNames: string[]) => {
        for (let i = 0; i < letterNames.length; i++) {
            discord.emojis.map((emoji: any) => {
                if (emoji.name === letterNames[i]) {
                    console.log(`{"name": "${letterNames[i]}", "id": "${emoji.id}"},`);
                }
            });
        } 
    }
}