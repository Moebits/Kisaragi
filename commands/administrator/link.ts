exports.run = async (client: any, message: any, args: string[]) => {
    let input = client.combineArgs(args, 1);
    if (input.trim()) {
        message.content = input.trim();
        linkPrompt(message);
        return;
    }
    let text = await client.fetchColumn("links", "text");
    let voice = await client.fetchColumn("links", "voice");
    let toggle = await client.fetchColumn("links", "toggle");

    let description = "";
    if (text[0]) {
        for (let i = 0; i < text[0].length; i++) {
            description += `**${i + 1} => **\n` + `${client.getEmoji("star")}_Text:_ <#${text[0][i]}>\n` +
            `${client.getEmoji("star")}_Voice:_ **<#${voice[0][i]}>**\n` +
            `${client.getEmoji("star")}_State:_ **${toggle[0][i]}**\n`
        }
    } else {
        description = "None";
    }
    let linkEmbed = client.createEmbed();
    linkEmbed
    .setTitle(`**Linked Channels** ${client.getEmoji("gabSip")}`)
    .setThumbnail(message.guild.iconURL)
    .setDescription(
        "Configure settings for linked channels. You can link a text channel to a voice channel so that only people in the voice channel can access it.\n" +
        "In order for this to work, you should disable the **read messages** permission on the text channel for all member roles.\n" +
        "\n" +
        "**Status** = Either on or off. In order for the status to be on, both the voice and text channel must be set.\n" +
        "\n" +
        "__Current Settings:__\n" +
        description + "\n" +
        "\n" +
        "__Edit Settings:__\n" +
        `${client.getEmoji("star")}_**Mention a text channel** to set the text channel._\n` +
        `${client.getEmoji("star")}_**Type the name of the voice channel** to set the voice channel._\n` +
        `${client.getEmoji("star")}_Type **toggle (setting number)** to toggle the status._\n` +
        `${client.getEmoji("star")}_Type **edit (setting number)** to edit a setting._\n` +
        `${client.getEmoji("star")}_Type **delete (setting number)** to delete a setting._\n` +
        `${client.getEmoji("star")}_Type **reset** to delete all settings._\n` +
        `${client.getEmoji("star")}_Type **cancel** to exit._\n` 
    )
    message.channel.send(linkEmbed)

    async function linkPrompt(msg: any) {
        let text = await client.fetchColumn("links", "text");
        let voice = await client.fetchColumn("links", "voice");
        let toggle = await client.fetchColumn("links", "toggle");
        let setText, setVoice, setInit;
        if (!text[0]) text = [[""]]; setInit = true;
        if (!voice[0]) voice = [[""]]; setInit = true;
        if (!toggle[0]) toggle = [[""]]; setInit = true;
        let responseEmbed = client.createEmbed();
        responseEmbed.setTitle(`**Linked Channels** ${client.getEmoji("gabSip")}`);
        if (msg.content.toLowerCase() === "cancel") {
            responseEmbed
            .setDescription(`${client.getEmoji("star")}Canceled the prompt!`)
            msg.channel.send(responseEmbed);
            return;
        } 
        if (msg.content.toLowerCase() === "reset") {
            await client.updateColumn("links", "voice", null);
            await client.updateColumn("links", "text", null);
            await client.updateColumn("links", "toggle", "off");
            responseEmbed
            .setDescription(`${client.getEmoji("star")}All settings were reset!`)
            msg.channel.send(responseEmbed);
            return;
        }
        if (msg.content.toLowerCase().includes("delete")) {
            let num = Number(msg.content.replace(/delete/gi, "").replace(/\s+/g, ""));
            if (num) {
                if (text[0]) {
                    text[0][num - 1] = "";
                    voice[0][num - 1] = "";
                    toggle[0][num - 1] = "";
                    text[0] = text[0].filter(Boolean);
                    voice[0] = voice[0].filter(Boolean);
                    toggle[0] = toggle[0].filter(Boolean);
                    await client.updateColumn("links", "text", text[0]);
                    await client.updateColumn("links", "voice", voice[0]);
                    await client.updateColumn("links", "toggle", toggle[0]);
                    responseEmbed
                    .setDescription(`${client.getEmoji("star")}Setting ${num} was deleted!`)
                    msg.channel.send(responseEmbed);
                    return;
                }
            } else {
                responseEmbed
                .setDescription(`${client.getEmoji("star")}Setting not found!`)
                msg.channel.send(responseEmbed);
                return;
            }
        }

        let newText = msg.content.match(/<#\d+>/g);
        let newVoice = msg.content.replace(/<#\d+>/g, "").match(/\D+/gi);
        if (newText) setText = true;
        if (newVoice) setVoice = true;

        let description = "";

        if (setText) {
            text[0].push(newText[0].replace(/<#/g, "").replace(/>/g, ""));
            if (setInit) text[0] = text[0].filter(Boolean);
            await client.updateColumn("links", "text", text);
            description += `${client.getEmoji("star")}Text channel set to **${newText[0]}**!\n`;
        }

        if (setVoice) {
            let channels = msg.guild.channels.filter((c: any) => {
                if (c.type === "voice") return c;
            });
            let channel = channels.find((c: any) => {
                if (c.name.replace(/\s+/g, " ").toLowerCase().includes(newVoice[0].toLowerCase())) return c;
            });
            if (channel) {
                voice[0].push(channel.id)
                if (setInit) voice[0] = voice[0].filter(Boolean);
                await client.updateColumn("links", "voice", voice);
                description += `${client.getEmoji("star")}Voice channel set to **${channel.name}**!\n`;
            } else {
                return msg.channel.send(responseEmbed.setDescription("Voice channel not found!"));
            } 
        }

        if (setText && setVoice) {
            toggle[0].push("on");
            if (setInit) toggle[0] = toggle[0].filter(Boolean);
            await client.updateColumn("links", "toggle", toggle);
            description += `${client.getEmoji("star")}Status set to **on**!\n`;
        } else {
            toggle[0].push("off")
            if (setInit) toggle[0] = toggle[0].filter(Boolean);
            await client.updateColumn("links", "toggle", toggle);
            description += `${client.getEmoji("star")}Status set to **off**!\n`;
        }
        
        responseEmbed
        .setDescription(description)
        msg.channel.send(responseEmbed);
        return;
    }

    client.createPrompt(linkPrompt);
}