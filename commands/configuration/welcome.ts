exports.run = async (client: any, message: any, args: string[]) => {
    const axios = require('axios');
    let input = client.combineArgs(args, 1);
    if (input.trim()) {
        message.content = input.trim();
        welcomePrompt(message);
        return;
    }
    let welcomeEmbed = client.createEmbed();
    let welcomeMsg = await client.fetchColumn("welcome leaves", "welcome message");
    let welcomeToggle = await client.fetchColumn("welcome leaves", "welcome toggle");
    let welcomeChannel = await client.fetchColumn("welcome leaves", "welcome channel");
    let welcomeImage = await client.fetchColumn("welcome leaves", "welcome bg image");
    let welcomeText = await client.fetchColumn("welcome leaves", "welcome bg text");
    let welcomeColor = await client.fetchColumn("welcome leaves", "welcome bg color");
    let attachment = await client.createCanvas(message.member, welcomeImage, welcomeText, welcomeColor);
    let json = await axios.get(`https://is.gd/create.php?format=json&url=${welcomeImage.join("")}`)
    let newImg = json.data.shorturl;
    welcomeEmbed
    .setTitle(`**Welcome Messages** ${client.getEmoji("karenSugoi")}`)
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
        `${client.getEmoji("star")}_Welcome Message:_ **${welcomeMsg}**\n` +
        `${client.getEmoji("star")}_Welcome Channel:_ **${welcomeChannel.join("") ? `<#${welcomeChannel}>` : "None"}**\n` +
        `${client.getEmoji("star")}_Welcome Toggle:_ **${welcomeToggle}**\n` +
        `${client.getEmoji("star")}_Background Image:_ **${newImg}**\n` +
        `${client.getEmoji("star")}_Background Text:_ **${welcomeText}**\n` +
        `${client.getEmoji("star")}_Background Text Color:_ **${welcomeColor}**\n` +
        "\n" +
        "__Edit Settings:__\n" +
        `${client.getEmoji("star")}_**Type any message** to set it as the welcome message._\n` +
        `${client.getEmoji("star")}_Type **enable** or **disable** to enable or disable welcome messages._\n` +
        `${client.getEmoji("star")}_**Mention a channel** to set it as the welcome channel._\n` +
        `${client.getEmoji("star")}_Post an **image URL** (jpg, png, gif) to set the background image._\n` +
        `${client.getEmoji("star")}_Add brackets **[text]** to set the background text._\n` +
        `${client.getEmoji("star")}_Type **rainbow** or a **hex color** to set the background text color._\n` +
        `${client.getEmoji("star")}_**You can type multiple options** to set them at once._\n` +
        `${client.getEmoji("star")}_Type **reset** to reset settings._\n` +
        `${client.getEmoji("star")}_Type **cancel** to exit._\n` 
    )
    message.channel.send(welcomeEmbed)

    async function welcomePrompt(msg: any) {
        let responseEmbed = client.createEmbed();
        let setMsg, setOn, setOff, setChannel, setImage, setBGText, setBGColor;
        responseEmbed.setTitle(`**Welcome Messages** ${client.getEmoji("karenSugoi")}`);
        let newMsg = msg.content.replace(/<#\d+>/g, "").replace(/\[(.*)\]/g, "").replace(/enable/g, "").replace(/rainbow/g, "")
        .replace(/disable/g, "").replace(/#[0-9a-f]{3,6}/ig, "").replace(/(https?:\/\/[^\s]+)/g, "");
        let newImg = msg.content.match(/(https?:\/\/[^\s]+)/g);
        let newBGText = msg.content.match(/\[(.*)\]/g);
        let newBGColor = (msg.content.match(/rainbow/g) || msg.content.match(/(\s|^)#[0-9a-f]{3,6}/ig));
        if (msg.content.toLowerCase() === "cancel") {
            responseEmbed
            .setDescription(`${client.getEmoji("star")}Canceled the prompt!`)
            msg.channel.send(responseEmbed);
            return;
        } 
        if (msg.content.toLowerCase() === "reset") {
            await client.updateColumn("welcome leaves", "welcome message", "Welcome to guild, user!");
            await client.updateColumn("welcome leaves", "welcome channel", null);
            await client.updateColumn("welcome leaves", "welcome toggle", "off");
            await client.updateColumn("welcome leaves", "welcome bg image", "https://66.media.tumblr.com/692aa1fd2a5ad428d92b27ccf65d4a94/tumblr_inline_n0oiz974M41s829k0.gif");
            await client.updateColumn("welcome leaves", "welcome bg text", "Welcome tag! There are now count members.");
            await client.updateColumn("welcome leaves", "welcome bg color", "rainbow");
            responseEmbed
            .setDescription(`${client.getEmoji("star")}Welcome settings were reset!`)
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
                .setDescription(`${client.getEmoji("star")}You cannot disable/enable at the same time.`)
                msg.channel.send(responseEmbed);
                return;
        }

        if (!setChannel && setOn) {
                responseEmbed
                .setDescription(`${client.getEmoji("star")}In order to enable welcome messages, you must specify a welcome channel!`)
                msg.channel.send(responseEmbed);
                return;
        }
        let description = "";
        if (setMsg) {
            await client.updateColumn("welcome leaves", "welcome message", newMsg.trim());
            description += `${client.getEmoji("star")}Welcome message set to **${newMsg.trim()}**\n`;
        }
        if (setChannel) {
            let channel = msg.guild.channels.find((c: any) => c === msg.mentions.channels.first());
            await client.updateColumn("welcome leaves", "welcome channel", channel.id);
            setOn = true;
            description += `${client.getEmoji("star")}Welcome channel set to <#${channel.id}>!\n`;
        }
        if (setOn) {
            await client.updateColumn("welcome leaves", "welcome toggle", "on");
            description += `${client.getEmoji("star")}Welcome messages are **on**!\n`;
        }
        if (setOff) {
            await client.updateColumn("welcome leaves", "welcome toggle", "off");
            description += `${client.getEmoji("star")}Welcome messages are **off**!\n`;
        }
        if (setImage) {
            await client.updateColumn("welcome leaves", "welcome bg image", newImg[0]);
            description += `${client.getEmoji("star")}Background image set to **${newImg[0]}**!\n`;
        }
        if (setBGText) {
            await client.updateColumn("welcome leaves", "welcome bg text", newBGText[0].replace(/\[/g, "").replace(/\]/g, ""));
            description += `${client.getEmoji("star")}Background text set to **${newBGText[0].replace(/\[/g, "").replace(/\]/g, "")}**\n`;
        }
        if (setBGColor) {
            await client.updateColumn("welcome leaves", "welcome bg color", newBGColor[0].trim());
            description += `${client.getEmoji("star")}Background color set to **${newBGColor[0].trim()}**!\n`;
        }

        responseEmbed
        .setDescription(description)
        msg.channel.send(responseEmbed);
        return;
    }

    client.createPrompt(welcomePrompt);
}