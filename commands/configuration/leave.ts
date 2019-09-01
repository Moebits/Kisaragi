exports.run = async (discord: any, message: any, args: string[]) => {
    if (await discord.checkAdmin(message)) return;
    const axios = require('axios');
    let input = discord.combineArgs(args, 1);
    if (input.trim()) {
        message.content = input.trim();
        leavePrompt(message);
        return;
    }
    let leaveEmbed = discord.createEmbed();
    let leaveMsg = await discord.fetchColumn("welcome leaves", "leave message");
    let leaveToggle = await discord.fetchColumn("welcome leaves", "leave toggle");
    let leaveChannel = await discord.fetchColumn("welcome leaves", "leave channel");
    let leaveImage = await discord.fetchColumn("welcome leaves", "leave bg image");
    let leaveText = await discord.fetchColumn("welcome leaves", "leave bg text");
    let leaveColor = await discord.fetchColumn("welcome leaves", "leave bg color");
    let attachment = await discord.createCanvas(message.member, leaveImage, leaveText, leaveColor);
    let json = await axios.get(`https://is.gd/create.php?format=json&url=${leaveImage.join("")}`)
    let newImg = json.data.shorturl;
    console.log(attachment)
    leaveEmbed
    .setTitle(`**Leave Messages** ${discord.getEmoji("sagiriBleh")}`)
    .setThumbnail(message.guild.iconURL)
    .attachFiles([attachment])
    .setImage(`attachment://${attachment.file.name ? attachment.file.name : "animated.gif"}`)
    .setDescription(
        "View and edit the settings for leave messages!\n" +
        "\n" +
        "__Text Replacements:__\n" +
        "**user** = member mention\n" +
        "**tag** = member tag\n" +
        "**name** = member name\n" +
        "**guild** = guild name\n" +
        "**count** = guild member count\n" +
        "\n" +
        "__Current Settings:__\n" +
        `${discord.getEmoji("star")}_Leave Message:_ **${leaveMsg}**\n` +
        `${discord.getEmoji("star")}_Leave Channel:_ **${leaveChannel.join("") ? `<#${leaveChannel}>` : "None"}**\n` +
        `${discord.getEmoji("star")}_Leave Toggle:_ **${leaveToggle}**\n` +
        `${discord.getEmoji("star")}_Background Image:_ **${newImg}**\n` +
        `${discord.getEmoji("star")}_Background Text:_ **${leaveText}**\n` +
        `${discord.getEmoji("star")}_Background Text Color:_ **${leaveColor}**\n` +
        "\n" +
        "__Edit Settings:__\n" +
        `${discord.getEmoji("star")}_**Type any message** to set it as the leave message._\n` +
        `${discord.getEmoji("star")}_Type **enable** or **disable** to enable or disable leave messages._\n` +
        `${discord.getEmoji("star")}_**Mention a channel** to set it as the leave channel._\n` +
        `${discord.getEmoji("star")}_Post an **image URL** (jpg, png, gif) to set the background image._\n` +
        `${discord.getEmoji("star")}_Add brackets **[text]** to set the background text._\n` +
        `${discord.getEmoji("star")}_Type **rainbow** or a **hex color** to set the background text color._\n` +
        `${discord.getEmoji("star")}_**You can type multiple options** to set them at once._\n` +
        `${discord.getEmoji("star")}_Type **reset** to reset settings._\n` +
        `${discord.getEmoji("star")}_Type **cancel** to exit._\n` 
    )
    message.channel.send(leaveEmbed)

    async function leavePrompt(msg: any) {
        let responseEmbed = discord.createEmbed();
        let setMsg, setOn, setOff, setChannel, setImage, setBGText, setBGColor;
        responseEmbed.setTitle(`**Leave Messages** ${discord.getEmoji("sagiriBleh")}`);
        let newMsg = msg.content.replace(/<#\d+>/g, "").replace(/\[(.*)\]/g, "").replace(/enable/g, "").replace(/rainbow/g, "")
        .replace(/disable/g, "").replace(/#[0-9a-f]{3,6}/ig, "").replace(/(https?:\/\/[^\s]+)/g, "");
        let newImg = msg.content.match(/(https?:\/\/[^\s]+)/g);
        let newBGText = msg.content.match(/\[(.*)\]/g);
        let newBGColor = (msg.content.match(/rainbow/g) || msg.content.match(/(\s|^)#[0-9a-f]{3,6}/ig));
        if (msg.content.toLowerCase() === "cancel") {
            responseEmbed
            .setDescription(`${discord.getEmoji("star")}Canceled the prompt!`)
            msg.channel.send(responseEmbed);
            return;
        } 
        if (msg.content.toLowerCase() === "reset") {
            await discord.updateColumn("welcome leaves", "leave message", "user has left guild!");
            await discord.updateColumn("welcome leaves", "leave channel", null);
            await discord.updateColumn("welcome leaves", "leave toggle", "off");
            await discord.updateColumn("welcome leaves", "leave bg image", "https://data.whicdn.com/images/210153523/original.gif");
            await discord.updateColumn("welcome leaves", "leave bg text", "tag left! There are now count members.");
            await discord.updateColumn("welcome leaves", "leave bg color", "rainbow");
            responseEmbed
            .setDescription(`${discord.getEmoji("star")}Leave settings were reset!`)
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

        if (setOn && setOff) {
            responseEmbed
                .setDescription(`${discord.getEmoji("star")}You cannot disable/enable at the same time.`)
                msg.channel.send(responseEmbed);
                return;
        }

        if (!setChannel && setOn) {
                responseEmbed
                .setDescription(`${discord.getEmoji("star")}In order to enable leave messages, you must specify a leave channel!`)
                msg.channel.send(responseEmbed);
                return;
        }
        let description = "";
        if (setMsg) {
            await discord.updateColumn("welcome leaves", "leave message", newMsg.trim());
            description += `${discord.getEmoji("star")}Leave Message set to **${newMsg.trim()}**\n`;
        }
        if (setChannel) {
            let channel = msg.guild.channels.find((c: any) => c === msg.mentions.channels.first());
            await discord.updateColumn("welcome leaves", "leave channel", channel.id);
            setOn = true;
            description += `${discord.getEmoji("star")}Leave channel set to <#${channel.id}>!\n`;
        }
        if (setOn) {
            await discord.updateColumn("welcome leaves", "leave toggle", "on");
            description += `${discord.getEmoji("star")}Leave Messages are **on**!\n`;
        }
        if (setOff) {
            await discord.updateColumn("welcome leaves", "leave toggle", "off");
            description += `${discord.getEmoji("star")}Leave Messages are **off**!\n`;
        }
        if (setImage) {
            await discord.updateColumn("welcome leaves", "leave bg image", newImg[0]);
            description += `${discord.getEmoji("star")}Background image set to **${newImg[0]}**!\n`;
        }
        if (setBGText) {
            await discord.updateColumn("welcome leaves", "leave bg text", newBGText[0].replace(/\[/g, "").replace(/\]/g, ""));
            description += `${discord.getEmoji("star")}Background text set to **${newBGText[0].replace(/\[/g, "").replace(/\]/g, "")}**\n`;
        }
        if (setBGColor) {
            await discord.updateColumn("welcome leaves", "leave bg color", newBGColor[0]);
            description += `${discord.getEmoji("star")}Background color set to **${newBGColor[0]}**!\n`;
        }

        responseEmbed
        .setDescription(description)
        msg.channel.send(responseEmbed);
        return;
    }

    discord.createPrompt(leavePrompt);
}