exports.run = async (client: any, message: any, args: string[]) => {
    const axios = require('axios');
    let input = client.combineArgs(args, 1);
    if (input.trim()) {
        message.content = input.trim();
        leavePrompt(message);
        return;
    }
    let leaveEmbed = client.createEmbed();
    let leaveMsg = await client.fetchColumn("welcome leaves", "leave message");
    let leaveToggle = await client.fetchColumn("welcome leaves", "leave toggle");
    let leaveChannel = await client.fetchColumn("welcome leaves", "leave channel");
    let leaveImage = await client.fetchColumn("welcome leaves", "leave bg image");
    let leaveText = await client.fetchColumn("welcome leaves", "leave bg text");
    let leaveColor = await client.fetchColumn("welcome leaves", "leave bg color");
    let attachment = await client.createCanvas(message.member, leaveImage, leaveText, leaveColor);
    let json = await axios.get(`https://is.gd/create.php?format=json&url=${leaveImage.join("")}`)
    let newImg = json.data.shorturl;
    leaveEmbed
    .setTitle(`**Leave Messages** ${client.getEmoji("sagiriBleh")}`)
    .setThumbnail(message.guild.iconURL)
    .attachFiles([attachment])
    .setImage(`attachment://${attachment.file.name}`)
    .setDescription(
        "Welcome to the Leave Messages prompt!\n" +
        "\n" +
        "__Text Replacements:__\n" +
        "**user** = member mention\n" +
        "**tag** = member tag\n" +
        "**name** = member name\n" +
        "**guild** = guild name\n" +
        "**count** = guild member count\n" +
        "\n" +
        "__Current Settings:__\n" +
        `${client.getEmoji("star")}_Leave Message:_ **${leaveMsg}**\n` +
        `${client.getEmoji("star")}_Leave Channel:_ **${leaveChannel.join("") ? `<#${leaveChannel}>` : "None"}**\n` +
        `${client.getEmoji("star")}_Leave Toggle:_ **${leaveToggle}**\n` +
        `${client.getEmoji("star")}_Background Image:_ **${newImg}**\n` +
        `${client.getEmoji("star")}_Background Text:_ **${leaveText}**\n` +
        `${client.getEmoji("star")}_Background Text Color:_ **${leaveColor}**\n` +
        "\n" +
        "__Edit Settings:__\n" +
        `${client.getEmoji("star")}_**Type any message** to set it as the leave message._\n` +
        `${client.getEmoji("star")}_Type **enable** or **disable** to enable or disable leave messages._\n` +
        `${client.getEmoji("star")}_**Mention a channel** to set it as the leave channel._\n` +
        `${client.getEmoji("star")}_Post an **image URL** (jpg, png, gif) to set the background image._\n` +
        `${client.getEmoji("star")}_Add brackets **[text]** to set the background text._\n` +
        `${client.getEmoji("star")}_Type **rainbow** or a **hex color** to set the background text color._\n` +
        `${client.getEmoji("star")}_**You can type multiple options** to set them at once._\n` +
        `${client.getEmoji("star")}_Type **reset** to reset settings._\n` +
        `${client.getEmoji("star")}_Type **cancel** to exit._\n` 
    )
    message.channel.send(leaveEmbed)

    async function leavePrompt(msg: any) {
        let responseEmbed = client.createEmbed();
        let setMsg, setOn, setOff, setChannel, setImage, setBGText, setBGColor;
        responseEmbed.setTitle(`**Leave Messages** ${client.getEmoji("sagiriBleh")}`);
        let newMsg = msg.content.replace(/<#\d+>/g, "").replace(/\[(.*)\]/g, "").replace(/enable/g, "").replace(/rainbow/g, "")
        .replace(/disable/g, "").replace(/#[0-9a-f]{3,6}/ig, "").replace(/(https?:\/\/[^\s]+)/g, "");
        let newImg = msg.content.match(/(https?:\/\/[^\s]+)/g);
        let newBGText = msg.content.match(/\[(.*)\]/g);
        let newBGColor = (msg.content.match(/rainbow/g) || msg.content.match(/(\s|^)#[0-9a-f]{3,6}/ig));
        if (msg.content === "cancel") {
            responseEmbed
            .setDescription(`${client.getEmoji("star")}Canceled the prompt!`)
            msg.channel.send(responseEmbed);
            return;
        } 
        if (msg.content.toLowerCase() === "reset") {
            await client.updateColumn("welcome leaves", "leave message", "user has left guild!");
            await client.updateColumn("welcome leaves", "leave channel", null);
            await client.updateColumn("welcome leaves", "leave toggle", "off");
            await client.updateColumn("welcome leaves", "leave bg image", "https://user-images.githubusercontent.com/565124/32411599-a5fcba72-c1df-11e7-8730-a570470a4eee.gif");
            await client.updateColumn("welcome leaves", "leave bg text", "tag left! There are now count members.");
            await client.updateColumn("welcome leaves", "leave bg color", "rainbow");
            responseEmbed
            .setDescription(`${client.getEmoji("star")}leave settings were reset!`)
            msg.channel.send(responseEmbed);
            return;
        }
        
        if (newBGColor) setBGColor = true;
        if (newMsg.trim()) setMsg = true;
        if (msg.content.toLowerCase().includes("enable")) setOn = true;
        if (msg.content.toLowerCase() === "disable") setOff = true;
        if (msg.mentions.channels.array().join("")) setChannel = true;
        if (newImg) setImage = true;
        if (newBGText) setBGText = true;

        if (!setChannel && setOn) {
                responseEmbed
                .setDescription(`${client.getEmoji("star")}In order to enable leave messages, you must specify a leave channel!`)
                msg.channel.send(responseEmbed);
                return;
        }
        let description = "";
        if (setMsg) {
            await client.updateColumn("welcome leaves", "leave message", newMsg.trim());
            description += `${client.getEmoji("star")}Leave Message set to **${newMsg.trim()}**\n`;
        }
        if (setChannel) {
            let channel = msg.guild.channels.find((c: any) => c === msg.mentions.channels.first());
            await client.updateColumn("welcome leaves", "leave channel", channel.id);
            setOn = true;
            description += `${client.getEmoji("star")}leave channel set to <#${channel.id}>!\n`;
        }
        if (setOn) {
            await client.updateColumn("welcome leaves", "leave toggle", "on");
            description += `${client.getEmoji("star")}Leave Messages are **on**!\n`;
        }
        if (setOff) {
            await client.updateColumn("welcome leaves", "leave toggle", "off");
            description += `${client.getEmoji("star")}Leave Messages are **off**!\n`;
        }
        if (setImage) {
            await client.updateColumn("welcome leaves", "leave bg image", newImg[0]);
            description += `${client.getEmoji("star")}Background image set to **${newImg[0]}**!\n`;
        }
        if (setBGText) {
            await client.updateColumn("welcome leaves", "leave bg text", newBGText[0].replace(/\[/g, "").replace(/\]/g, ""));
            description += `${client.getEmoji("star")}Background text set to **${newBGText[0].replace(/\[/g, "").replace(/\]/g, "")}**!\n`;
        }
        if (setBGColor) {
            await client.updateColumn("welcome leaves", "leave bg color", newBGColor[0]);
            description += `${client.getEmoji("star")}Background color set to **${newBGColor[0]}**!\n`;
        }

        responseEmbed
        .setDescription(description)
        msg.channel.send(responseEmbed);
        return;
    }

    client.createPrompt(leavePrompt);
}