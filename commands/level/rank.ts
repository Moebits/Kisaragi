exports.run = async (client: any, message: any, score: any, args: string[]) => {

    const {createCanvas} = require("canvas");
    const canvas = createCanvas(400, 10);
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 400, 10);
    let rawPointThreshold: string[] = await client.fetchColumn("points", "point threshold");
    let pointThreshold: number = Number(rawPointThreshold);

    let userScore = await client.fetchScore();
    let userLevel = await client.fetchLevel();

    const rankEmbed: any = client.createEmbed();

    if (userScore === (null || undefined)) {
        ctx.fillStyle = "#ff3d9b";
        message.channel.send(rankEmbed
            .setDescription("Could not find a score for you!"));
    } else {
        let percent: number = (100 / pointThreshold) * (score.points % pointThreshold);
        let width: number = (percent / 100) * 400 
        ctx.fillRect(0, 0, width, 10);
        let dataUrl = await canvas.toDataURL('image/png')
            message.channel.send(rankEmbed
                .setTitle(`**${message.author.username}'s Rank**`)
                .setDescription(`Level -> **${userLevel}** ` + 
                `| Points -> **${userScore}** ` + 
                `| Progress -> ${userScore % pointThreshold}/${pointThreshold} ` +
                `| ${percent}% of the way there!`)
                .setImage(dataUrl)
                .setThumbnail(message.author.displayAvatarURL))
        
    }
}