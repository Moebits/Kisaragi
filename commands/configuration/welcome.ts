exports.run = async (discord: any, message: any, args: string[]) => {
    if (await discord.checkAdmin(message)) return;
    const axios = require('axios');
    let input = discord.combineArgs(args, 1);
    if (input.trim()) {
        message.content = input.trim();
        welcomePrompt(message);
        return;
    }
    let welcomeEmbed = discord.createEmbed();
    let welcomeMsg = await discord.fetchColumn("welcome leaves", "welcome message");
    let welcomeToggle = await discord.fetchColumn("welcome leaves", "welcome toggle");
    let welcomeChannel = await discord.fetchColumn("welcome leaves", "welcome channel");
    let welcomeImage = await discord.fetchColumn("welcome leaves", "welcome bg image");
    let welcomeText = await discord.fetchColumn("welcome leaves", "welcome bg text");
    let welcomeColor = await discord.fetchColumn("welcome leaves", "welcome bg color");
    let attachment = await discord.createCanvas(message.member, welcomeImage, welcomeText, welcomeColor);
    let json = await axios.get(`https://is.gd/create.php?format=json&url=${welcomeImage.join("")}`)
    let newImg = json.data.shorturl;
    welcomeEmbed
    .setTitle(`**Welcome Messages** ${discord.getEmoji("karenSugoi")}`)
    .setThumbnail(message.guild.iconURL)
    .attachFiles([attachment])
    .setImage(`attachment://${attachment.file.name ? attachment.file.name : "animated.gif"}`)
    .setDescription(
        "View and edit the settings for welcome messages!\n" +
        "\n" +
        "__Text Replacements:__\n" +
        "**user** = member mention\n" +
        "**tag** = member tag\n" +
        "**name** = member name\n" +
        "**guild** = guild name\n" +
        "**count** = guild member count\n" +
        "\n" +
        "__Current Settings:__\n" +
        `${discord.getEmoji("star")}_Welcome Message:_ **${welcomeMsg}**\n` +
        `${discord.getEmoji("star")}_Welcome Channel:_ **${welcomeChannel.join("") ? `<#${welcomeChannel}>` : "None"}**\n` +
        `${discord.getEmoji("star")}_Welcome Toggle:_ **${welcomeToggle}**\n` +
        `${discord.getEmoji("star")}_Background Image:_ **${newImg}**\n` +
        `${discord.getEmoji("star")}_Background Text:_ **${welcomeText}**\n` +
        `${discord.getEmoji("star")}_Background Text Color:_ **${welcomeColor}**\n` +
        "\n" +
        "__Edit Settings:__\n" +
        `${discord.getEmoji("star")}_**Type any message** to set it as the welcome message._\n` +
        `${discord.getEmoji("star")}_Type **enable** or **disable** to enable or disable welcome messages._\n` +
        `${discord.getEmoji("star")}_**Mention a channel** to set it as the welcome channel._\n` +
        `${discord.getEmoji("star")}_Post an **image URL** (jpg, png, gif) to set the background image._\n` +
        `${discord.getEmoji("star")}_Add brackets **[text]** to set the background text._\n` +
        `${discord.getEmoji("star")}_Type **rainbow** or a **hex color** to set the background text color._\n` +
        `${discord.getEmoji("star")}_**You can type multiple options** to set them at once._\n` +
        `${discord.getEmoji("star")}_Type **reset** to reset settings._\n` +
        `${discord.getEmoji("star")}_Type **cancel** to exit._\n` 
    )
    message.channel.send(welcomeEmbed)

    async function welcomePrompt(msg: any) {
        let responseEmbed = discord.createEmbed();
        let setMsg, setOn, setOff, setChannel, setImage, setBGText, setBGColor;
        responseEmbed.setTitle(`**Welcome Messages** ${discord.getEmoji("karenSugoi")}`);
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
            await discord.updateColumn("welcome leaves", "welcome message", "Welcome to guild, user!");
            await discord.updateColumn("welcome leaves", "welcome channel", null);
            await discord.updateColumn("welcome leaves", "welcome toggle", "off");
            await discord.updateColumn("welcome leaves", "welcome bg image", "https://66.media.tumblr.com/692aa1fd2a5ad428d92b27ccf65d4a94/tumblr_inline_n0oiz974M41s829k0.gif");
            await discord.updateColumn("welcome leaves", "welcome bg text", "Welcome tag! There are now count members.");
            await discord.updateColumn("welcome leaves", "welcome bg color", "rainbow");
            responseEmbed
            .setDescription(`${discord.getEmoji("star")}Welcome settings were reset!`)
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
                .setDescription(`${discord.getEmoji("star")}In order to enable welcome messages, you must specify a welcome channel!`)
                msg.channel.send(responseEmbed);
                return;
        }
        let description = "";
        if (setMsg) {
            await discord.updateColumn("welcome leaves", "welcome message", newMsg.trim());
            description += `${discord.getEmoji("star")}Welcome message set to **${newMsg.trim()}**\n`;
        }
        if (setChannel) {
            let channel = msg.guild.channels.find((c: any) => c === msg.mentions.channels.first());
            await discord.updateColumn("welcome leaves", "welcome channel", channel.id);
            setOn = true;
            description += `${discord.getEmoji("star")}Welcome channel set to <#${channel.id}>!\n`;
        }
        if (setOn) {
            await discord.updateColumn("welcome leaves", "welcome toggle", "on");
            description += `${discord.getEmoji("star")}Welcome messages are **on**!\n`;
        }
        if (setOff) {
            await discord.updateColumn("welcome leaves", "welcome toggle", "off");
            description += `${discord.getEmoji("star")}Welcome messages are **off**!\n`;
        }
        if (setImage) {
            await discord.updateColumn("welcome leaves", "welcome bg image", newImg[0]);
            description += `${discord.getEmoji("star")}Background image set to **${newImg[0]}**!\n`;
        }
        if (setBGText) {
            await discord.updateColumn("welcome leaves", "welcome bg text", newBGText[0].replace(/\[/g, "").replace(/\]/g, ""));
            description += `${discord.getEmoji("star")}Background text set to **${newBGText[0].replace(/\[/g, "").replace(/\]/g, "")}**\n`;
        }
        if (setBGColor) {
            await discord.updateColumn("welcome leaves", "welcome bg color", newBGColor[0].trim());
            description += `${discord.getEmoji("star")}Background color set to **${newBGColor[0].trim()}**!\n`;
        }

        responseEmbed
        .setDescription(description)
        msg.channel.send(responseEmbed);
        return;
    }

    discord.createPrompt(welcomePrompt);
}