exports.run = async (discord: any, message: any, args: string[]) => {
    const  google = require('google-it');
    const {Attachment} = require("discord.js");
    let query = discord.combineArgs(args, 1);

    let resultArray: string[] = [];
 
    let result = await google({"query": query, "limit": 50})
    for (let i in result) {
        resultArray.push(`${discord.getEmoji("star")}_Title:_ **${result[i].title}**`);
        resultArray.push(`${discord.getEmoji("star")}_Link:_ ${result[i].link}`);
    }
    let googleEmbedArray: any = [];
    await discord.runCommand(message, ["screenshot", "return", `https://www.google.com/search?q=${query.trim().replace(/ /g, "+")}`]);
    let attachment = await new Attachment("../assets/images/screenshot.png");
    for (let i = 0; i < resultArray.length; i+=10) { 
        let googleEmbed = discord.createEmbed();
        googleEmbed
        .setAuthor("google", "https://cdn4.iconfinder.com/data/icons/new-google-logo-2015/400/new-google-favicon-512.png")
        .setTitle(`**Google Search** ${discord.getEmoji("raphi")}`)
        .setThumbnail(message.author.displayAvatarURL)
        .attachFiles([attachment.file])
        .setImage(`attachment://screenshot.png`)
        .setDescription(resultArray.slice(i, i+10).join("\n"))
        googleEmbedArray.push(googleEmbed);
    }
    discord.createReactionEmbed(googleEmbedArray);
}