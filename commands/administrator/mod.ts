exports.run = async (discord: any, message: any, args: string[]) => {
    if (await discord.checkAdmin(message)) return;
    let input = discord.combineArgs(args, 1);
    if (input.trim()) {
        message.content = input.trim();
        modPrompt(message);
        return;
    }

    let ascii = await discord.fetchColumn("blocks", "ascii name toggle");
    let mute = await discord.fetchColumn("special roles", "mute role");
    let restrict = await discord.fetchColumn("special roles", "restricted role");
    let warnOne = await discord.fetchColumn("special roles", "warn one");
    let warnTwo = await discord.fetchColumn("special roles", "warn two");
    let admin = await discord.fetchColumn("special roles", "admin role");
    let mod = await discord.fetchColumn("special roles", "mod role");
    let warnPenalty = await discord.fetchColumn("warns", "warn penalty");
    let warnThreshold = await discord.fetchColumn("warns", "warn threshold");

    let modEmbed = discord.createEmbed();
    modEmbed
    .setTitle(`**Moderator Settings** ${discord.getEmoji("karenAnger")}`)
    .setThumbnail(message.guild.iconURL)
    .setDescription(
        "Edit moderation settings for the server.\n" +
        "\n" +
        "**Restricted Role** = Can be any role with restricted permissions.\n" +
        "**Warn Threshold** = How many warnings will trigger the punishment.\n" +
        "**Warn Penalty** = The punishment after hitting the warn threshold.\n" +
        "**Ascii Names** = Removes all non-ascii characters in usernames.\n" +
        "\n" +
        "__Current Settings__\n" +
        `${discord.getEmoji("star")}Admin role: ${admin.join("") ? `<@&${admin.join("")}>` : "None"}\n` +
        `${discord.getEmoji("star")}Mod role: ${mod.join("") ? `<@&${mod.join("")}>` : "None"}\n` +
        `${discord.getEmoji("star")}Mute role: ${mute.join("") ? `<@&${mute.join("")}>` : "None"}\n` +
        `${discord.getEmoji("star")}Restricted role: ${restrict.join("") ? `<@&${restrict.join("")}>` : "None"}\n` +
        `${discord.getEmoji("star")}Warn One role: ${warnOne.join("") ? `<@&${warnOne.join("")}>` : "None"}\n` +
        `${discord.getEmoji("star")}Warn Two role: ${warnTwo.join("") ? `<@&${warnTwo.join("")}>` : "None"}\n` +
        `${discord.getEmoji("star")}Warn Threshold: **${warnThreshold.join("")}**\n` +
        `${discord.getEmoji("star")}Warn Penalty: **${warnPenalty.join("") ? `${warnPenalty.join("")}` : "none"}**\n` +
        `${discord.getEmoji("star")}Ascii names are **${ascii.join("")}**\n` +
        "\n" +
        "__Edit Settings__\n" +
        `${discord.getEmoji("star")}Type **ascii** to toggle ascii names on/off.\n` +
        `${discord.getEmoji("star")}Type **any number** to set the warning threshold.\n` +
        `${discord.getEmoji("star")}Type **ban**, **kick**, **mute**, or **none** to set the warn penalty.\n` +
        `${discord.getEmoji("star")}**Mention a role or type a role id** to set the admin role.\n` +
        `${discord.getEmoji("star")}Do the same **between exclamation points !role!** to set the mod role.\n` +
        `${discord.getEmoji("star")}Do the same **between percent signs %role%** to set the mute role.\n` +
        `${discord.getEmoji("star")}Do the same **between dollar signs $role$** to set the restricted role.\n` +
        `${discord.getEmoji("star")}Do the same **between parentheses (role)** to set the role for warn one.\n` +
        `${discord.getEmoji("star")}Do the same **between brackets [role]** to set the role for warn two.\n` +
        `${discord.getEmoji("star")}**Type multiple settings** to set them at once.\n` +
        `${discord.getEmoji("star")}Type **reset** to reset settings.\n` +
        `${discord.getEmoji("star")}Type **cancel** to exit.\n`
    )

    message.channel.send(modEmbed);

    async function modPrompt(msg: any) {
        let responseEmbed = discord.createEmbed();
        responseEmbed.setTitle(`**Moderator Settings** ${discord.getEmoji("karenAnger")}`)
        let ascii = await discord.fetchColumn("blocks", "ascii name toggle");
        let setAscii, setMute, setRestrict, setWarnOne, setWarnTwo, setWarnPenalty, setWarnThreshold, setAdmin, setMod;
        if (msg.content.toLowerCase() === "cancel") {
            responseEmbed
            .setDescription(`${discord.getEmoji("star")}Canceled the prompt!`)
            msg.channel.send(responseEmbed);
            return;
        } 
        if (msg.content.toLowerCase() === "reset") {
            await discord.updateColumn("blocks", "ascii name toggle", "off");
            await discord.updateColumn("special roles", "mute role", null);
            await discord.updateColumn("special roles", "restricted role", null);
            await discord.updateColumn("special roles", "warn one", null);
            await discord.updateColumn("special roles", "warn one", null);
            await discord.updateColumn("warns", "warn penalty", "none");
            await discord.updateColumn("warns", "warn threshold", null);
            responseEmbed
            .setDescription(`${discord.getEmoji("star")}All settings were reset!`)
            msg.channel.send(responseEmbed);
            return;
        }
        let newMsg = msg.content.replace(/<@&/g, "").replace(/>/g, "");
        let adminRole = newMsg.replace(/\s+\d\s+/, "").replace(/\s+/g, "").replace(/(?<=\$)(.*?)(?=\$)/g, "").replace(/(?<=\()(.*?)(?=\))/g, "")
        .replace(/(?<=!)(.*?)(?=!)/g, "").replace(/(?<=#)(.*?)(?=#)/g, "").replace(/(?<=\[)(.*?)(?=\])/g, "").match(/\d+/g);
        let modRole = newMsg.replace(/\s+/g, "").match(/(?<=!)(.*?)(?=!)/g);
        let muteRole = newMsg.replace(/\s+/g, "").match(/(?<=#)(.*?)(?=#)/g);
        let restrictRole = newMsg.replace(/\s+/g, "").match(/(?<=\$)(.*?)(?=\$)/g);
        let warnOneRole = newMsg.replace(/\s+/g, "").match(/(?<=\()(.*?)(?=\))/g);
        let warnTwoRole = newMsg.replace(/\s+/g, "").match(/(?<=\[)(.*?)(?=\])/g);
        let warnPenalty = newMsg.match(/ban/gi) || newMsg.match(/kick/gi) || newMsg.match(/mute/gi) || newMsg.match(/none/gi);
        let warnThreshold = newMsg.match(/\s\d\s+/);
        if (msg.content.match(/ascii/gi)) setAscii = true;
        if (adminRole) setAdmin = true;
        if (modRole) setMod = true;
        if (muteRole) setMute = true;
        if (restrictRole) setRestrict = true;
        if (warnOneRole) setWarnOne = true;
        if (warnTwoRole) setWarnTwo = true;
        if (warnPenalty) setWarnPenalty = true;
        if (warnThreshold) setWarnThreshold = true;

        let description = "";

        if (setAscii) {
            if (ascii.join("") === "off") {
                await discord.updateColumn("blocks", "ascii name toggle", "on");
                description += `${discord.getEmoji("star")}Ascii names are **on**!\n`
            } else {
                await discord.updateColumn("blocks", "ascii name toggle", "off");
                description += `${discord.getEmoji("star")}Ascii names are **off**!\n`
            }
        }

        if (setAdmin) {
            await discord.updateColumn("special roles", "admin role", adminRole.join(""));
            description += `${discord.getEmoji("star")}Admin role set to <@&${adminRole.join("")}>!\n`
        }

        if (setMod) {
            await discord.updateColumn("special roles", "mod role", modRole.join(""));
            description += `${discord.getEmoji("star")}Mod role set to <@&${modRole.join("")}>!\n`
        }

        if (setMute) {
            await discord.updateColumn("special roles", "mute role", muteRole.join(""));
            description += `${discord.getEmoji("star")}Mute role set to <@&${muteRole.join("")}>!\n`
        }

        if (setRestrict) {
            await discord.updateColumn("special roles", "restricted role", restrictRole.join(""));
            description += `${discord.getEmoji("star")}Restricted role set to <@&${restrictRole.join("")}>!\n`
        }

        if (setWarnOne) {
            await discord.updateColumn("special roles", "warn one", warnOneRole.join(""));
            description += `${discord.getEmoji("star")}Warn one role set to <@&${warnOneRole.join("")}>!\n`
        }

        if (setWarnTwo) {
            await discord.updateColumn("special roles", "warn two", warnTwoRole.join(""));
            description += `${discord.getEmoji("star")}Warn two role set to <@&${warnTwoRole.join("")}>!\n`
        }

        if (setWarnThreshold) {
            await discord.updateColumn("warns", "warn threshold", warnThreshold.join(""));
            description += `${discord.getEmoji("star")}Warn threshold set to **${warnThreshold.join("").trim()}**!\n`
        }

        if (setWarnPenalty) {
            await discord.updateColumn("warns", "warn penalty", warnPenalty.join(""));
            description += `${discord.getEmoji("star")}Warn penalty set to **${warnPenalty.join("").trim()}**!\n`
        }

        responseEmbed
        .setDescription(description)
        msg.channel.send(responseEmbed);
        return;

    }

    discord.createPrompt(modPrompt);
}