exports.run = async (client: any, message: any, score: any, args: string[]) => {

    const {Attachment} = require("discord.js");
    let imageDataURI = require("image-data-uri");

    const {createCanvas} = require("canvas");
    const canvas = createCanvas(200, 5);
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 200, 5);
    let rawPointThreshold: string[] = await client.fetchColumn("points", "point threshold");
    let pointThreshold: number = Number(rawPointThreshold);

    let userScore = await client.fetchScore(message);
    let userLevel = await client.fetchLevel(message);

    console.log(userScore)
    console.log(userLevel)

    const rankEmbed: any = client.createEmbed();

    if (userScore === (null || undefined)) {
        message.channel.send(rankEmbed
            .setDescription("Could not find a score for you!"));
    } else {
        let percent: number = (100 / pointThreshold) * (userScore % pointThreshold);
        let width: number = (percent / 100) * 200 
        ctx.fillStyle = "#ff3d9b";
        ctx.fillRect(0, 0, width, 5);
        console.log(width)
        let dataUrl = await canvas.toDataURL();
        await imageDataURI.outputFile(dataUrl, `../../assets/images/rankBar.jpg`);
        let attachment = new Attachment(`../../assets/images/rankBar.jpg`)
        message.channel.send(rankEmbed
            .setTitle(`**${message.author.username}'s Rank ${client.getEmoji("kisaragiCircle")}**`)
            .setDescription(
            `${client.getEmoji("star")}_Level_: **${userLevel}**\n` + 
            `${client.getEmoji("star")}_Points_: **${userScore}**\n` + 
            `${client.getEmoji("star")}_Progress_: ${userScore}/${(pointThreshold * userLevel) + pointThreshold}\n` +
            `${client.getEmoji("star")}**${percent.toFixed(1)}%** of the way there!`)
            .attachFiles([attachment.file])
            .setImage(`attachment://rankBar.jpg`)
            .setThumbnail(message.author.displayAvatarURL))
        
    }
}