exports.run = async (discord: any, message: any, args: string[]) => {
    if (await discord.checkMod(message)) return;
    let warnThreshold = await discord.fetchColumn("warns", "warn threshold");
    let warnPenalty = await discord.fetchColumn("warns", "warn penalty");
    let warnOne = await discord.fetchColumn("special roles", "warn one");
    let warnTwo = await discord.fetchColumn("special roles", "warn two");
    let warnLog = await discord.fetchColumn("warns", "warn log");
    let setInit = false;
    if (!warnLog.join("")) warnLog = [[0]]; setInit = true;

    let warnOneRole, warnTwoRole;
    if (warnOne[0]) warnOneRole = message.guild.roles.find((r: any) => r.id === warnOne[0]);
    if (warnTwo[0]) warnTwoRole = message.guild.roles.find((r: any) => r.id === warnTwo[0]);

    let reasonArray: any = [];
    let userArray: any = [];
    for (let i = 1; i < args.length; i++) {
        if (args[i].match(/\d+/g)) {
            userArray.push(args[i].match(/\d+/g))[0];
        } else {
            reasonArray.push(args[i]);
        }
    }
    
    let reason = reasonArray.join("") ? reasonArray.join(" ") : "None provided!";

    async function checkWarns(warnLog: any, userID:　any) {
        let member = await message.guild.members.find((m: any) => m.id === userID);
        let warnReason = `Exceeded the threshold of ${warnThreshold[0]} warns.`;
        let dmEmbed = discord.createEmbed();
        let guildEmbed = discord.createEmbed();
        let dm = await member.createDM();
        for (let i = 0; i < warnLog.length; i++) {
            if (typeof warnLog[i] === "string") warnLog[i] = JSON.parse(warnLog[i]);
            if (warnLog[i].user === userID) {
                if (warnLog[i].warns.length >= 1) {
                    if (warnOneRole) {
                        if (!member.roles.has(warnOneRole.id)) {
                            await member.addRole(warnOneRole);
                            message.channel.send(
                                `<@${userID}>, you were given the ${warnOneRole} role because you have one warn.`
                            )
                        }
                    }
                }
                if (warnLog[i].warns.length >= 2) {
                    if (warnTwoRole) {
                        if (!member.roles.has(warnTwoRole.id)) {
                            await member.addRole(warnTwoRole);
                            message.channel.send(
                                `<@${userID}>, you were given the ${warnTwoRole} role because you have two warns.`
                            )
                        }
                    }
                }
                if (warnLog[i].warns.length >= parseInt(warnThreshold[0])) {
                    switch (warnPenalty[0].toLowerCase().trim()) {
                        case "ban": 
                            dmEmbed
                            .setAuthor("ban", "https://discordemoji.com/assets/emoji/bancat.png")
                            .setTitle(`**You Were Banned** ${discord.getEmoji("kannaFU")}`)
                            .setDescription(`${discord.getEmoji("star")}_You were banned from ${message.guild.name} for reason:_ **${warnReason}**`);
                            try {
                                await dm.send(dmEmbed);
                            } catch (err) {
                                console.log(err);
                            }
                            guildEmbed
                            .setAuthor("ban", "https://discordemoji.com/assets/emoji/bancat.png")
                            .setTitle(`**Member Banned** ${discord.getEmoji("kannaFU")}`)
                            .setDescription(`${discord.getEmoji("star")}_Successfully banned <@${userID}> for reason:_ **${warnReason}**`);
                            await member.ban(warnReason);
                            message.channel.send(guildEmbed);
                            break;
                        case "kick":
                            dmEmbed
                            .setAuthor("kick", "https://discordemoji.com/assets/emoji/4331_UmaruWave.png")
                            .setTitle(`**You Were Kicked** ${discord.getEmoji("kannaFU")}`)
                            .setDescription(`${discord.getEmoji("star")}_You were kicked from ${message.guild.name} for reason:_ **${warnReason}**`);
                            try {
                                await dm.send(dmEmbed);
                            } catch (err) {
                                console.log(err);
                            }
                            guildEmbed
                            .setAuthor("kick", "https://discordemoji.com/assets/emoji/4331_UmaruWave.png")
                            .setTitle(`**Member Kicked** ${discord.getEmoji("kannaFU")}`)
                            .setDescription(`${discord.getEmoji("star")}_Successfully kicked <@${userID}> for reason:_ **${warnReason}**`);
                            await member.kick(warnReason);
                            message.channel.send(guildEmbed);
                            break;
                        case "mute":
                            let mute = await discord.fetchColumn("special roles", "mute role");
                            if (!mute) {
                                message.reply(`Failed to mute <@${userID}>. You do not have a mute role set!`);
                                return false;
                            }
                            await member.addRole(mute.join(""));
                            dmEmbed
                            .setAuthor("mute", "https://images.emojiterra.com/mozilla/512px/1f507.png")
                            .setTitle(`**You Were Muted** ${discord.getEmoji("kannaFU")}`)
                            .setDescription(`${discord.getEmoji("star")}_You were muted from ${message.guild.name} for reason:_ **${warnReason}**`);
                            try {
                                await dm.send(dmEmbed);
                            } catch (err) {
                                console.log(err);
                            }
                            guildEmbed
                            .setAuthor("mute", "https://images.emojiterra.com/mozilla/512px/1f507.png")
                            .setTitle(`**Member Muted** ${discord.getEmoji("kannaFU")}`)
                            .setDescription(`${discord.getEmoji("star")}_Successfully muted <@${userID}> for reason:_ **${warnReason}**`);
                            await member.kick(warnReason);
                            message.channel.send(guildEmbed);
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    }

    warnLog = warnLog[0];

    for (let i = 0; i < userArray.length; i++) {
        let found = false;
        for (let j = 0; j < warnLog.length; j++) {
            warnLog[j] = JSON.parse(warnLog[j]);
            if (userArray[i].join("") === warnLog[j].user ? warnLog[j].user.toString() : null) {
                warnLog[j].warns.push(reason);
                found = true;
            }
        }
        if (!found) {
            warnLog.push(`{"user": "${userArray[i].join("")}", "warns": ["${reason}"]}`);
        }
        for (let j = 0; j < warnLog.length; j++) {
            warnLog[j] = JSON.parse(JSON.stringify(warnLog[j]));
        }
        await checkWarns(warnLog, userArray[i].join(""));
    }

    if (setInit) warnLog = warnLog.filter(Boolean);
    await discord.updateColumn("warns", "warn log", warnLog);

    let users = "";
    for (let i = 0; i < userArray.length; i++) {
        users += `<@${userArray[i]}> `;
        let warnDMEmbed = discord.createEmbed();
        warnDMEmbed
        .setAuthor("warn", "https://www.emoji.co.uk/files/phantom-open-emojis/symbols-phantom/13025-warning-sign.png")
        .setTitle(`**You Were Warned** ${discord.getEmoji("kannaFU")}`)
        .setDescription(
            `${discord.getEmoji("star")}_You were warned in ${message.guild.name} for reason: **${reason}**_`
        )
        let member = await message.guild.members.find((m: any) => m.id === userArray[i].join(""));
        let dm = await member.createDM();
        await dm.send(warnDMEmbed);
    }

    let warnEmbed: any = discord.createEmbed();
    warnEmbed
    .setAuthor("warn", "https://www.emoji.co.uk/files/phantom-open-emojis/symbols-phantom/13025-warning-sign.png")
    .setTitle(`**Member Warned** ${discord.getEmoji("kannaFU")}`)
    .setDescription(
        `${discord.getEmoji("star")}_Successfully warned ${users} for reason: **${reason}**_`
    )
    message.channel.send(warnEmbed);
}