exports.run = async (client: any, message: any, score: any, args: string[]) => {

    const {Attachment} = require("discord.js");
    let imageDataURI = require("image-data-uri");

    const {createCanvas} = require("canvas");
    const canvas = createCanvas(400, 10);
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 400, 10);
    let rawPointThreshold: string[] = await client.fetchColumn("points", "point threshold");
    let pointThreshold: number = Number(rawPointThreshold);

    let userScore = await client.fetchScore();
    let userLevel = await client.fetchLevel();

    console.log(userScore)
    console.log(userLevel)

    const rankEmbed: any = client.createEmbed();

    if (userScore === (null || undefined)) {
        //ctx.fillStyle = "#ff3d9b";
        message.channel.send(rankEmbed
            .setDescription("Could not find a score for you!"));
    } else {
        let percent: number = (100 / pointThreshold) * (userScore % pointThreshold);
        let width: number = (percent / 100) * 400 
        ctx.fillRect(0, 0, width, 10);
        let dataUrl = await canvas.toDataURL();
        await imageDataURI.outputFile(dataUrl, `../../assets/images/rankBar.jpg`);
        let attachment = new Attachment(`../../assets/images/rankBar.jpg`)
        message.channel.send(rankEmbed
            .setTitle(`**${message.author.username}'s Rank**`)
            .setDescription(`Level -> **${userLevel}** ` + 
            `| Points -> **${userScore}** ` + 
            `| Progress -> ${userScore % pointThreshold}/${pointThreshold} ` +
            `| ${percent}% of the way there!`)
            .attachFiles([attachment.file])
            .setImage(`attachment://rankBar.jpg`)
            .setThumbnail(message.author.displayAvatarURL))
        
    }
}