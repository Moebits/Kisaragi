exports.run = async (client: any, message: any, args: string[]) => {
    let input = client.combineArgs(args, 1);
    if (input.trim()) {
        message.content = input.trim();
        levelPrompt(message);
        return;
    }

    let pointToggle = await client.fetchColumn("points", "point toggle");
    let pointRange = await client.fetchColumn("points", "point range");
    let pointThreshold = await client.fetchColumn("points", "point threshold");
    let pointTimeout = await client.fetchColumn("points", "point timeout");
    let levelMsg = await client.fetchColumn("points", "level message");
    let levelEmbed = client.createEmbed();
    levelEmbed
    .setTitle(`**Level Settings** ${client.getEmoji("mexShrug")}`)
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
        `${client.getEmoji("star")}_Point Toggle:_ **${pointToggle.join("")}**\n` +
        `${client.getEmoji("star")}_Point Range:_ **${pointRange.join("")}**\n` +
        `${client.getEmoji("star")}_Point Threshold:_ **${pointThreshold.join("")}**\n` +
        `${client.getEmoji("star")}_Point Timeout:_ **${Math.floor(parseInt(pointTimeout.join(""))/1000)}**\n` +
        `${client.getEmoji("star")}_Level Message:_ **${levelMsg.join("")}**\n` +
        "\n" +
        "__Edit Settings:__\n" +
        `${client.getEmoji("star")}_**Type any message** to set the level message._\n` +
        `${client.getEmoji("star")}_Type **enable** or **disable** to enable or disable the point system._\n` +
        `${client.getEmoji("star")}_Use brackets **[10, 20]** to set the point range._\n` +
        `${client.getEmoji("star")}_Use braces **{1000}** to set the point threshold._\n` +
        `${client.getEmoji("star")}_Use angle brackets **<60>** to set the point timeout._\n` +
        `${client.getEmoji("star")}_**You can type multiple options** to enable all at once._\n` +
        `${client.getEmoji("star")}_Type **destroy** to delete all the points of every member (no undo)._\n` +
        `${client.getEmoji("star")}_Type **reset** to reset all settings._\n` +
        `${client.getEmoji("star")}_Type **cancel** to exit._\n`
    )
    message.channel.send(levelEmbed)

    async function levelPrompt(msg: any) {   
        let responseEmbed = client.createEmbed();
        responseEmbed.setTitle(`**Level Settings** ${client.getEmoji("mexShrug")}`);
        let setOn, setOff, setRange, setThreshold, setTimeout, setMsg;
        if (msg.content.toLowerCase() === "cancel") {
            responseEmbed
            .setDescription(`${client.getEmoji("star")}Canceled the prompt!`)
            msg.channel.send(responseEmbed);
            return;
        } 
        if (msg.content.toLowerCase() === "reset") {
            await client.updateColumn("points", "point range", [10, 20]);
            await client.updateColumn("points", "point threshold", 1000);
            await client.updateColumn("points", "point timeout", 60000);
            await client.updateColumn("points", "point toggle", "off");
            await client.updateColumn("points", "level message", "Congrats user, you are now level newlevel!");
            responseEmbed
            .setDescription(`${client.getEmoji("star")}Level settings were reset!`)
            msg.channel.send(responseEmbed);
            return;
        }
        if (msg.content.toLowerCase() === "destroy") {
            await client.updateColumn("points", "score list", null);
            await client.updateColumn("points", "level list", null);
            responseEmbed
            .setDescription(`${client.getEmoji("star")}Points were destroyed for every member in the guild!`)
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
                .setDescription(`${client.getEmoji("star")}You cannot disable/enable at the same time.`)
                msg.channel.send(responseEmbed);
                return;
        }

        if (setMsg) {
            await client.updateColumn("points", "level message", newMsg);
            description += `${client.getEmoji("star")}Level message set to **${newMsg}**\n` 
        }

        if (setOn) {
            await client.updateColumn("points", "point toggle", "off");
            description += `${client.getEmoji("star")}Leveling is now **enabled**!\n` 
        }
        if (setOn) {
            await client.updateColumn("points", "point toggle", "on");
            description += `${client.getEmoji("star")}Leveling is now **disabled**!\n` 
        }
        if (setRange) {
            await client.updateColumn("points", "point range", newRange);
            description += `${client.getEmoji("star")}Point range set to **${newRange}**!\n` 
        }
        if (setThreshold) {
            await client.updateColumn("points", "point range", newThreshold[0]);
            description += `${client.getEmoji("star")}Point threshold set to **${newThreshold[0].replace(/\{/g, "").replace(/\}/g, "")}**!\n` 
        }
        if (setTimeout) {
            await client.updateColumn("points", "point range", [Math.floor(parseInt(newTimeout[0].replace(/</g, "").replace(/>/g, ""))*1000)]);
            description += `${client.getEmoji("star")}Point timeout set to **${newTimeout[0].replace(/</g, "").replace(/>/g, "")}**!\n` 
        }

        responseEmbed
        .setDescription(description)
        msg.channel.send(responseEmbed);
        return;
    }

    client.createPrompt(levelPrompt);
}