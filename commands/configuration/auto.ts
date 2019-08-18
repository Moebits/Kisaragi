exports.run = async (discord: any, message: any, args: string[]) => {
    let input = discord.combineArgs(args, 1);
    if (input.trim()) {
        message.content = input.trim();
        autoPrompt(message);
        return;
    }
    
    let command = await discord.fetchColumn("auto", "command");
    let channel = await discord.fetchColumn("auto", "channel");
    let frequency = await discord.fetchColumn("auto", "frequency");
    let toggle = await discord.fetchColumn("auto", "toggle");
    let settings = "";
    if (command[0]) {
        for (let i = 0; i < command[0].length; i++) {
            settings += `${i + 1} **=>**\n` +
            `${discord.getEmoji("star")}_Command:_ **${command[0][i] !== "0" ? command[0][i] : "None"}**\n`+
            `${discord.getEmoji("star")}_Channel:_ **${channel[0][i] !== "0" ? "<#" + channel[0][i] + ">" : "None"}**\n`+
            `${discord.getEmoji("star")}_Frequency:_ **${frequency[0][i] !== "0" ? frequency[0][i] : "None"}**\n` +
            `${discord.getEmoji("star")}_State:_ **${toggle[0][i]}**\n`
        }
        if (!command[0].join("")) settings = "None";
    } else {
        settings = "None";
    }
    let autoEmbed = discord.createEmbed();
    autoEmbed
    .setTitle(`**Auto Commands** ${discord.getEmoji("think")}`)
    .setThumbnail(message.guild.iconURL)
    .setDescription(
        "Configure settings for auto commands. You can set up a maximum of 10 auto commands.\n" +
        "\n" +
        "**Frequency** = How often the command will run, in hours.\n" +
        "**State** = Active (on) or Inactive (off).\n" +
        "\n" +
        "__Current Settings:__\n" +
        `${settings}\n` +
        "\n" +
        "__Edit Settings:__\n" +
        `${discord.getEmoji("star")}_Type **any command** to set the command._\n` +
        `${discord.getEmoji("star")}_**Mention any channel** to set the channel._\n` +
        `${discord.getEmoji("star")}_Type **any number** to set the frequency._\n` +
        `${discord.getEmoji("star")}_You can set **multiple options at once**._\n` +
        `${discord.getEmoji("star")}_Type **toggle (setting number)** to toggle the state._\n` +
        `${discord.getEmoji("star")}_Type **edit (setting number)** to edit a setting._\n` +
        `${discord.getEmoji("star")}_Type **delete (setting number)** to delete a setting._\n` +
        `${discord.getEmoji("star")}_Type **reset** to delete all settings._\n` +
        `${discord.getEmoji("star")}_Type **cancel** to exit._\n` 
    )

    message.channel.send(autoEmbed)

    async function autoPrompt(msg: any) {
        let responseEmbed = discord.createEmbed();
        responseEmbed.setDescription(`**Auto Commands** ${discord.getEmoji("think")}`)
        let setCmd, setChannel, setFreq, setInit;
        let cmd = await discord.fetchColumn("auto", "command");
        let chan = await discord.fetchColumn("auto", "channel");
        let freq = await discord.fetchColumn("auto", "frequency");
        let tog = await discord.fetchColumn("auto", "toggle");
        let tim = await discord.fetchColumn("auto", "timeout");
        if (!cmd[0]) cmd = [[0]]; setInit = true;
        if (!chan[0]) chan = [[0]]; setInit = true;
        if (!freq[0]) freq = [[0]]; setInit = true;
        if (!tog[0]) tog = [[0]]; setInit = true;
        if (msg.content.toLowerCase().startsWith("delete")) {
            let newMsg = Number(msg.content.replace(/delete/g, "").trim());
            let num = newMsg - 1;
            if (newMsg) {
                    cmd[0][num] = 0;
                    chan[0][num] = 0;
                    freq[0][num] = 0;
                    tog[0][num] = 0;
                    tim[0][num] = 0;
                    let arrCmd = cmd[0].filter(Boolean);
                    let arrChan = chan[0].filter(Boolean);
                    let arrFreq = freq[0].filter(Boolean);
                    let arrTog = tog[0].filter(Boolean);
                    let arrTim = tim[0].filter(Boolean);
                    await discord.updateColumn("auto", "command", arrCmd);
                    await discord.updateColumn("auto", "channel", arrChan);
                    await discord.updateColumn("auto", "frequency", arrFreq); 
                    await discord.updateColumn("auto", "toggle", arrTog);   
                    await discord.updateColumn("auto", "timeout", arrTim);   
                    return msg.channel.send(responseEmbed.setDescription(`Setting **${newMsg}** was deleted!`));
            } else {
                return msg.channel.send(responseEmbed.setDescription("Setting not found!"));
            }
        }
        if (msg.content.toLowerCase().startsWith("toggle")) {
            let newMsg = Number(msg.content.replace(/toggle/g, "").trim());
            let num = newMsg - 1;
            let testCmd = await discord.fetchColumn("auto", "command");
            let testChan = await discord.fetchColumn("auto", "channel");
            let testFreq = await discord.fetchColumn("auto", "frequency");
            if (newMsg && testCmd && testChan && testFreq) {
                    if (tog[0][num] === "inactive") {
                        await discord.updateColumn("auto", "toggle", "active");
                        return msg.channel.send(responseEmbed.setDescription(`State of setting **${newMsg}** is now **active**!`));
                    } else {
                        await discord.updateColumn("auto", "toggle", "inactive");
                        return msg.channel.send(responseEmbed.setDescription(`State of setting **${newMsg}** is now **inactive**!`));
                    }  
            } else {
                return msg.channel.send(responseEmbed.setDescription("You cannot use the toggle command on an unfinished setting!"));
            }
        }
        if (msg.content.toLowerCase().startsWith("edit")) {
            let newMsg = msg.content.replace(/edit/g, "").trim().split(" ");
            let tempMsg = newMsg.slice(1).join(" ");
            let num = Number(newMsg[0]) - 1;
            if (tempMsg) {
                let newCmd = tempMsg.match(/\D+/gi) ? tempMsg.match(/\D+/gi).join("").replace(/<#/g, "").replace(/>/g, "").trim() : null;
                let newChan = tempMsg.match(/<#\d+>/g) ? tempMsg.match(/<#\d+>/g).join("").replace(/<#/g, "").replace(/>/g, "") : null;
                let reChan = new RegExp(newChan,"g");
                let newFreq = tempMsg.replace(/\D+/gi, "").replace(reChan, "").replace(/\s+/g, "");
                let editDesc = "";
                if (newCmd) {
                    cmd[0][num] = newCmd;
                    await discord.updateColumn("auto", "command", cmd[0]);
                    editDesc += `${discord.getEmoji("star")}Command set to **${newCmd}**!\n`
                }
                if (newChan) {
                    chan[0][num] = newChan;
                    await discord.updateColumn("auto", "channel", chan[0]);
                    editDesc += `${discord.getEmoji("star")}Channel set to **${newChan}**!\n`
                }
                if (newFreq) {
                    freq[0][num] = newFreq;    
                    await discord.updateColumn("auto", "frequency", freq[0]); 
                    editDesc += `${discord.getEmoji("star")}Command set to **${newFreq}**!\n`
                }
                let testCmd = await discord.fetchColumn("auto", "command");
                let testChan = await discord.fetchColumn("auto", "channel");
                let testFreq = await discord.fetchColumn("auto", "frequency");
                if (testCmd[0][num] && testChan[0][num] && testFreq[0][num]) {
                    tog[0][num] = "active"
                    await discord.updateColumn("auto", "toggle", tog[0]);
                    editDesc += `${discord.getEmoji("star")}This setting is **active**!\n`;
                } else {
                    tog[0][num] = "inactive"
                    await discord.updateColumn("auto", "toggle", tog[0]);
                    editDesc += `${discord.getEmoji("star")}This setting is **inactive**!\n`;
                }
                return msg.channel.send(responseEmbed.setDescription(editDesc));
            } else {
                return msg.channel.send(responseEmbed.setDescription("No edits specified!"));
            }
        }
        if (msg.content.toLowerCase() === "cancel") {
            responseEmbed
            .setDescription(`${discord.getEmoji("star")}Canceled the prompt!`)
            msg.channel.send(responseEmbed);
            return;
        } 
        if (msg.content.toLowerCase() === "reset") {
            await discord.updateColumn("auto", "command", null);
            await discord.updateColumn("auto", "channel", null);
            await discord.updateColumn("auto", "frequency", null);
            await discord.updateColumn("auto", "toggle", null);
            await discord.updateColumn("auto", "timeout", null);
            responseEmbed
            .setDescription(`${discord.getEmoji("star")}Auto settings were wiped!`)
            msg.channel.send(responseEmbed);
            return;
        }

        let newCmd = msg.content.match(/\D+/gi).join("").replace(/<#/g, "").replace(/>/g, "").trim();
        let newChan = msg.content.match(/<#\d+>/g).join("").replace(/<#/g, "").replace(/>/g, "");
        let reChan = new RegExp(newChan,"g");
        let newFreq = msg.content.replace(/\D+/gi, "").replace(reChan, "").replace(/\s+/g, "");
        if (newCmd) setCmd = true;
        if (newChan) setChannel = true;
        if (newFreq) setFreq = true;

        let description = "";

        if (setCmd) {
            if (cmd[0].length === 10) {
                return msg.channel.send(responseEmbed.setDescription("You can only set 10 auto commands!"));
            } else {
                cmd[0].push(newCmd);
                let arrCmd = cmd[0].filter(Boolean);
                await discord.updateColumn("auto", "command", arrCmd);
                description += `${discord.getEmoji("star")}Command set to **${newCmd}**!\n`;
            }
        }

        if (setChannel) {
            if (cmd[0].length === 10) {
                return msg.channel.send(responseEmbed.setDescription("You can only set 10 auto commands!"));
            } else {
                chan[0].push(newChan);
                let arrChan = chan[0].filter(Boolean);
                await discord.updateColumn("auto", "channel", arrChan);
                description += `${discord.getEmoji("star")}Channel set to <#${newChan}>!\n`;
            }
        }

        if (setFreq) {
            if (cmd[0].length === 10) {
                return msg.channel.send(responseEmbed.setDescription("You can only set 10 auto commands!"));
            } else {
                freq[0].push(newFreq);
                let arrFreq = freq[0].filter(Boolean);
                await discord.updateColumn("auto", "frequency", arrFreq);
                description += `${discord.getEmoji("star")}Frequency set to **${newFreq}**!\n`;
            }
        }

        if (!setCmd) {
            if (setInit) cmd[0] = cmd[0].filter(Boolean);
            cmd[0].push(0);
            await discord.updateColumn("auto", "command", cmd[0]);
        }
        if (!setChannel) {
            if (setInit) chan[0] = chan[0].filter(Boolean);
            chan[0].push(0);
            await discord.updateColumn("auto", "command", chan[0]);
        }
        if (!setFreq) {
            if (setInit) freq[0] = freq[0].filter(Boolean);
            freq[0].push(0);
            await discord.updateColumn("auto", "command", freq[0]);
        }

        if (setCmd && setChannel && setFreq) {
            tog[0] = tog[0].filter(Boolean);
            tog[0].push("active")
            await discord.updateColumn("auto", "toggle", tog[0]);
            description += `${discord.getEmoji("star")}This setting is **active**!\n`;
        } else {
            tog[0] = tog[0].filter(Boolean);
            tog[0].push("inactive")
            await discord.updateColumn("auto", "toggle", tog[0]);
            description += `${discord.getEmoji("star")}This setting is **inactive**!\n`;
        }

        responseEmbed
        .setDescription(description)
        msg.channel.send(responseEmbed);
        return;

    }

    discord.createPrompt(autoPrompt)
}