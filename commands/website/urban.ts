exports.run = async (discord: any, message: any, args: string[]) => {

    const urban = require('urban.js');
    let urbanEmbed = discord.createEmbed();
    
    if (args[1]) {
        let word = args[1];
        let result = await urban(word);
        let cleanDef = result.definition.replace(/(\[|\])/g, "").replace(/(\r\n|\n|\r)/gm,"");
        let cleanExample = result.example.replace(/(\[|\])/g, "").replace(/(\r\n|\n|\r)/gm,"");
        let checkedExample = discord.checkChar(cleanExample, 1700, ".");
        urbanEmbed
        .setAuthor("Urban Dictionary", "https://firebounty.com/image/635-urban-dictionary")
        .setURL(result.URL)
        .setTitle(`**Urban Dictionary** ${discord.getEmoji("smugFace")}`)
        .setDescription(
        `${discord.getEmoji("star")}**Word**: ${result.word}\n` +
        `${discord.getEmoji("star")}**Author**: ${result.author ? result.author : "None"}\n` +
        `${discord.getEmoji("star")}${discord.getEmoji("up")} ${result.thumbsUp} ${discord.getEmoji("down")} ${result.thumbsDown}\n` +
        `${discord.getEmoji("star")}**Definition**: ${cleanDef ? cleanDef : "None"}\n` +
        `${discord.getEmoji("star")}**Example**: ${checkedExample ? checkedExample : "None"}`
        )
        .setThumbnail(message.author.displayAvatarURL)
        message.channel.send(urbanEmbed);
        return;
    }
 
    let result = await urban.random()
        let cleanDef = result.definition.replace(/(\[|\])/g, "").replace(/(\r\n|\n|\r)/gm,"");
        let cleanExample = result.example.replace(/(\[|\])/g, "").replace(/(\r\n|\n|\r)/gm,"");
        let checkedExample = discord.checkChar(cleanExample, 1700, ".");
        urbanEmbed
        .setAuthor("Urban Dictionary", "https://firebounty.com/image/635-urban-dictionary")
        .setURL(result.URL)
        .setTitle(`**Urban Dictionary** ${discord.getEmoji("smugFace")}`)
        .setDescription(
        `${discord.getEmoji("star")}**Word**: ${result.word}\n` +
        `${discord.getEmoji("star")}**Author**: ${result.author ? result.author : "None"}\n` +
        `${discord.getEmoji("star")}${discord.getEmoji("up")} ${result.thumbsUp} ${discord.getEmoji("down")} ${result.thumbsDown}\n` +
        `${discord.getEmoji("star")}**Definition**: ${cleanDef ? cleanDef : "None"}\n` +
        `${discord.getEmoji("star")}**Example**: ${checkedExample ? checkedExample : "None"}`
        )
        .setThumbnail(message.author.displayAvatarURL)
        message.channel.send(urbanEmbed);
}