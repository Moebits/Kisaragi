exports.run = async (discord: any, message: any, args: string[]) => {
    if (await discord.checkAdmin(message)) return;
    let input = discord.combineArgs(args, 1);
    if (input.trim()) {
        message.content = input.trim();
        detectPrompt(message);
        return;
    }

    let ignored = await discord.fetchColumn("detection", "ignored");
    let step = 5.0;
    let increment = Math.ceil((ignored[0] ? ignored[0].length : 1) / step);
    let detectArray: any = [];
    for (let i = 0; i < increment; i++) {
        let description = "";
        for (let j = 0; j < step; j++) {
            if (ignored[0]) {
                let value = (i*step)+j;
                if (!ignored[0][value]) break;
                description += `**${value + 1} =>**\n` +
                `${discord.getEmoji("star")}Channel: ${ignored[0] ? (ignored[0][value] ? `<#${ignored[0][value]}>` : "None") : "None"}\n`
            } else {
                description = "None";
            }
        }
        let detectEmbed = discord.createEmbed();
        detectEmbed
        .setTitle(`**Ignored Detection Channels** ${discord.getEmoji("kisaragibawls")}`)
        .setThumbnail(message.guild.iconURL)
        .setDescription(
            "Channels in this list will be exempt from anime detection.\n" +
            "\n" +
            "__Current Settings__\n" +
            description + "\n" +
            "\n" +
            "__Edit Settings__\n" +
            `${discord.getEmoji("star")}**Mention channels** to add channels.\n` +
            `${discord.getEmoji("star")}Type **reset** to delete all settings.\n` +
            `${discord.getEmoji("star")}Type **cancel** to exit.\n`
        )
        detectArray.push(detectEmbed);
    }
    
    if (detectArray.length > 1) {
        discord.createReactionEmbed(detectArray);
    } else {
        message.channel.send(detectArray[0]);
    }
    
    async function detectPrompt(msg: any) {
        let ignored = await discord.fetchColumn("detection", "ignored");
        let responseEmbed = discord.createEmbed();
        responseEmbed.setTitle(`**Ignored Detection Channels** ${discord.getEmoji("kisaragibawls")}`);
        let setInit = false;
        if (!ignored[0]) ignored = [[0]]; setInit = true;
        if (msg.content.toLowerCase() === "cancel") {
            responseEmbed
            .setDescription(`${discord.getEmoji("star")}Canceled the prompt!`)
            msg.channel.send(responseEmbed);
            return;
        } 
        if (msg.content.toLowerCase() === "reset") {
            await discord.updateColumn("detection", "ignored", null);
            responseEmbed
            .setDescription(`${discord.getEmoji("star")}All settings were **reset**!`)
            msg.channel.send(responseEmbed);
            return;
        }

        let newChan = msg.content.match(/(?<=<#)(.*?)(?=>)/g);
        if (!newChan.join("")) return msg.reply("You did not mention any channels!");

        let description = "";

        for (let i = 0; i < newChan.length; i++) {
            ignored[0].push(newChan[i]);
            if (setInit) ignored[0] = ignored[0].filter(Boolean);
            await discord.updateColumn("detection", "ignored", ignored[0]);
            description += `${discord.getEmoji("star")}Added <#${newChan[i]}>!\n`
        }

        responseEmbed
        .setDescription(description)
        msg.channel.send(responseEmbed);
        return;
    }

    discord.createPrompt(detectPrompt);
}