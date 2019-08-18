exports.run = async (discord: any, message: any, args: string[]) => {
    let input = discord.combineArgs(args, 1);
    if (input.trim()) {
        message.content = input.trim();
        levelPrompt(message);
        return;
    }

    let pointToggle = await discord.fetchColumn("points", "point toggle");
    let pointRange = await discord.fetchColumn("points", "point range");
    let pointThreshold = await discord.fetchColumn("points", "point threshold");
    let pointTimeout = await discord.fetchColumn("points", "point timeout");
    let levelMsg = await discord.fetchColumn("points", "level message");
    let levelEmbed = discord.createEmbed();
    levelEmbed
    .setTitle(`**Level Settings** ${discord.getEmoji("mexShrug")}`)
    .setThumbnail(message.guild.iconURL)
    .setDescription(
        "Configure general level settings. To set level up roles, use **levelroles** instead. To toggle points on individual channels, use **levelchannels** instead. To add or remove points from a user, use **give** instead.\n" +
        "\n" +
        "__Text Replacements:__\n" +
        "**user** = member mention\n" +
        "**tag** = member tag\n" +
        "**name** = member name\n" +
        "**newlevel** = new level\n" +
        "**totalpoints** = total points\n" +
        "\n" +
        "**Point Range** = The range of points to award per message.\n" +
        "**Point Threshold** = The amount of points required to level up.\n" +
        "**Point Timeout** = How often points are awarded (in seconds).\n" +
        "\n" +
        "__Current Settings:__\n" +
        `${discord.getEmoji("star")}_Point Toggle:_ **${pointToggle.join("")}**\n` +
        `${discord.getEmoji("star")}_Point Range:_ **${pointRange.join("")}**\n` +
        `${discord.getEmoji("star")}_Point Threshold:_ **${pointThreshold.join("")}**\n` +
        `${discord.getEmoji("star")}_Point Timeout:_ **${Math.floor(parseInt(pointTimeout.join(""))/1000)}**\n` +
        `${discord.getEmoji("star")}_Level Message:_ **${levelMsg.join("")}**\n` +
        "\n" +
        "__Edit Settings:__\n" +
        `${discord.getEmoji("star")}_**Type any message** to set the level message._\n` +
        `${discord.getEmoji("star")}_Type **enable** or **disable** to enable or disable the point system._\n` +
        `${discord.getEmoji("star")}_Use brackets **[10, 20]** to set the point range._\n` +
        `${discord.getEmoji("star")}_Use braces **{1000}** to set the point threshold._\n` +
        `${discord.getEmoji("star")}_Use angle brackets **<60>** to set the point timeout._\n` +
        `${discord.getEmoji("star")}_**You can type multiple options** to enable all at once._\n` +
        `${discord.getEmoji("star")}_Type **destroy** to delete all the points of every member (no undo)._\n` +
        `${discord.getEmoji("star")}_Type **reset** to reset all settings._\n` +
        `${discord.getEmoji("star")}_Type **cancel** to exit._\n`
    )
    message.channel.send(levelEmbed)

    async function levelPrompt(msg: any) {   
        let responseEmbed = discord.createEmbed();
        responseEmbed.setTitle(`**Level Settings** ${discord.getEmoji("mexShrug")}`);
        let setOn, setOff, setRange, setThreshold, setTimeout, setMsg;
        if (msg.content.toLowerCase() === "cancel") {
            responseEmbed
            .setDescription(`${discord.getEmoji("star")}Canceled the prompt!`)
            msg.channel.send(responseEmbed);
            return;
        } 
        if (msg.content.toLowerCase() === "reset") {
            await discord.updateColumn("points", "point range", [10, 20]);
            await discord.updateColumn("points", "point threshold", 1000);
            await discord.updateColumn("points", "point timeout", 60000);
            await discord.updateColumn("points", "point toggle", "off");
            await discord.updateColumn("points", "level message", "Congrats user, you are now level newlevel!");
            responseEmbed
            .setDescription(`${discord.getEmoji("star")}Level settings were reset!`)
            msg.channel.send(responseEmbed);
            return;
        }
        if (msg.content.toLowerCase() === "destroy") {
            await discord.updateColumn("points", "score list", null);
            await discord.updateColumn("points", "level list", null);
            responseEmbed
            .setDescription(`${discord.getEmoji("star")}Points were destroyed for every member in the guild!`)
            msg.channel.send(responseEmbed);
            return;
        }
        let newMsg = msg.content.replace(/enable/g, "").replace(/disable/g, "").replace(/\[(.*)\]/g, "")
        .replace(/<(.*)>/g, "").replace(/\{(.*)\}/g).replace(/\s/g, "");
        let newRange = msg.content.match(/\[(.*)\]/g);
        let newTimeout = msg.content.match(/<(.*)>/g);
        let newThreshold = msg.content.match(/\{(.*)\}/g);
        if (msg.content.match(/enable/g)) setOn = true;
        if (msg.content.match(/disable/g)) setOff = true;
        if (newRange) setRange = true;
        if (newTimeout) setTimeout = true;
        if (newThreshold) setThreshold = true;
        if (newMsg) setMsg = true;
        if (newMsg === "undefined") setMsg = false;

        let description = "";

        if (setOn && setOff) {
            responseEmbed
                .setDescription(`${discord.getEmoji("star")}You cannot disable/enable at the same time.`)
                msg.channel.send(responseEmbed);
                return;
        }

        if (setMsg) {
            await discord.updateColumn("points", "level message", newMsg);
            description += `${discord.getEmoji("star")}Level message set to **${newMsg}**\n` 
        }

        if (setOn) {
            await discord.updateColumn("points", "point toggle", "off");
            description += `${discord.getEmoji("star")}Leveling is now **enabled**!\n` 
        }
        if (setOn) {
            await discord.updateColumn("points", "point toggle", "on");
            description += `${discord.getEmoji("star")}Leveling is now **disabled**!\n` 
        }
        if (setRange) {
            await discord.updateColumn("points", "point range", newRange);
            description += `${discord.getEmoji("star")}Point range set to **${newRange}**!\n` 
        }
        if (setThreshold) {
            await discord.updateColumn("points", "point range", newThreshold[0]);
            description += `${discord.getEmoji("star")}Point threshold set to **${newThreshold[0].replace(/\{/g, "").replace(/\}/g, "")}**!\n` 
        }
        if (setTimeout) {
            await discord.updateColumn("points", "point range", [Math.floor(parseInt(newTimeout[0].replace(/</g, "").replace(/>/g, ""))*1000)]);
            description += `${discord.getEmoji("star")}Point timeout set to **${newTimeout[0].replace(/</g, "").replace(/>/g, "")}**!\n` 
        }

        responseEmbed
        .setDescription(description)
        msg.channel.send(responseEmbed);
        return;
    }

    discord.createPrompt(levelPrompt);
}