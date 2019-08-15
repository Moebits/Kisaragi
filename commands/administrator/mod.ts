exports.run = async (client: any, message: any, args: string[]) => {
    let input = client.combineArgs(args, 1);
    if (input.trim()) {
        message.content = input.trim();
        modPrompt(message);
        return;
    }

    let ascii = await client.fetchColumn("blocks", "ascii name toggle");
    let mute = await client.fetchColumn("special roles", "mute role");
    let restrict = await client.fetchColumn("special roles", "restricted role");

    let modEmbed = client.createEmbed();
    modEmbed
    .setTitle(`**Moderator Settings** ${client.getEmoji("karenAnger")}`)
    .setThumbnail(message.guild.iconURL)
    .setDescription(
        "Edit moderation settings for the server.\n" +
        "\n" +
        "**Restricted Role** = Should be a role with restricted permissions.\n" +
        "**Ascii Names** = Removes all non-ascii characters in usernames.\n" +
        "\n" +
        "__Current Settings__\n" +
        `${client.getEmoji("star")}Mute role: ${mute.join("") ? `<@&${mute.join("")}>` : "None"}\n` +
        `${client.getEmoji("star")}Restricted role: ${restrict.join("") ? `<@&${restrict.join("")}>` : "None"}\n` +
        `${client.getEmoji("star")}Ascii names are **${ascii.join("")}**.\n` +
        "\n" +
        "__Edit Settings__\n" +
        `${client.getEmoji("star")}Type **ascii** to toggle ascii names on/off.\n` +
        `${client.getEmoji("star")}**Mention a role or type a role id** to set the mute role.\n` +
        `${client.getEmoji("star")}Mention a role or type a role id **between brackets [role]** to set the restricted role.\n` +
        `${client.getEmoji("star")}Type **reset** to reset settings.\n` +
        `${client.getEmoji("star")}Type **cancel** to exit.\n`
    )

    message.channel.send(modEmbed);

    async function modPrompt(msg: any) {
        let responseEmbed = client.createEmbed();
        responseEmbed.setTitle(`**Moderator Settings** ${client.getEmoji("karenAnger")}`)
        let ascii = await client.fetchColumn("blocks", "ascii name toggle");
        let setAscii, setMute, setRestrict;
        if (msg.content.toLowerCase() === "cancel") {
            responseEmbed
            .setDescription(`${client.getEmoji("star")}Canceled the prompt!`)
            msg.channel.send(responseEmbed);
            return;
        } 
        if (msg.content.toLowerCase() === "reset") {
            await client.updateColumn("blocks", "ascii name toggle", "off");
            await client.updateColumn("special roles", "mute role", null);
            await client.updateColumn("special roles", "restricted role", null);
            responseEmbed
            .setDescription(`${client.getEmoji("star")}All settings were reset!`)
            msg.channel.send(responseEmbed);
            return;
        }
        let newMsg = msg.content.replace(/<@&/g, "").replace(/>/g, "").replace(/\s+/g, "");
        let muteRole = newMsg.replace(/(?<=\[)(.*?)(?=\])/g, "").match(/\d+/g);
        let restrictRole = newMsg.match(/(?<=\[)(.*?)(?=\])/g);
        if (msg.content.match(/ascii/gi)) setAscii = true;
        if (muteRole) setMute = true;
        if (restrictRole) setRestrict = true;

        let description = "";

        if (setAscii) {
            if (ascii.join("") === "off") {
                await client.updateColumn("blocks", "ascii name toggle", "on");
                description += `${client.getEmoji("star")}Ascii names are **on**!\n`
            } else {
                await client.updateColumn("blocks", "ascii name toggle", "off");
                description += `${client.getEmoji("star")}Ascii names are **off**!\n`
            }
        }

        if (setMute) {
            await client.updateColumn("special roles", "mute role", muteRole.join(""));
            description += `${client.getEmoji("star")}Mute role set to <@&${muteRole.join("")}>!\n`
        }

        if (setRestrict) {
            await client.updateColumn("special roles", "restricted role", restrictRole.join(""));
            description += `${client.getEmoji("star")}Restricted role set to <@&${restrictRole.join("")}>!\n`
        }

        responseEmbed
        .setDescription(description)
        msg.channel.send(responseEmbed);
        return;

    }

    client.createPrompt(modPrompt);
}