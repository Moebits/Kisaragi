exports.run = async (discord: any, message: any, score: any, args: string[]) => {

    const {Attachment} = require("discord.js");
    let imageDataURI = require("image-data-uri");

    const {createCanvas} = require("canvas");
    const canvas = createCanvas(200, 5);
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 200, 5);
    let rawPointThreshold: string[] = await discord.fetchColumn("points", "point threshold");
    let pointThreshold: number = Number(rawPointThreshold);

    let userScore = await discord.fetchScore(message);
    let userLevel = await discord.fetchLevel(message);

    const rankEmbed: any = discord.createEmbed();

    if (userScore === (null || undefined)) {
        message.channel.send(rankEmbed
            .setDescription("Could not find a score for you!"));
    } else {
        let percent: number = (100 / pointThreshold) * (userScore % pointThreshold);
        let width: number = (percent / 100) * 200 
        ctx.fillStyle = "#ff3d9b";
        ctx.fillRect(0, 0, width, 5);
        let dataUrl = await canvas.toDataURL();
        await imageDataURI.outputFile(dataUrl, `../assets/images/rankBar.jpg`);
        let attachment = await new Attachment(`../assets/images/rankBar.jpg`)
        message.channel.send(rankEmbed
            .setTitle(`**${message.author.username}'s Rank ${discord.getEmoji("kannaXD")}**`)
            .setDescription(
            `${discord.getEmoji("star")}_Level_: **${userLevel}**\n` + 
            `${discord.getEmoji("star")}_Points_: **${userScore}**\n` + 
            `${discord.getEmoji("star")}_Progress_: ${userScore}/${(pointThreshold * userLevel) + pointThreshold}\n` +
            `${discord.getEmoji("star")}**${percent.toFixed(1)}%** of the way there!`)
            .attachFiles([attachment.file])
            .setImage(`attachment://rankBar.jpg`)
            .setThumbnail(message.author.displayAvatarURL))
        
    }
}