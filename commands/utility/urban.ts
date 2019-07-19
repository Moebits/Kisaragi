exports.run = async (client: any, message: any, args: string[]) => {

    const urban = require('urban.js');
    let urbanEmbed = client.createEmbed();
    
    if (args[1]) {
        let word = args[1];
        let result = await urban(word);
        let cleanDef = result.definition.replace(/(\[|\])/g, "").replace(/(\r\n|\n|\r)/gm,"");
        let cleanExample = result.example.replace(/(\[|\])/g, "").replace(/(\r\n|\n|\r)/gm,"");
        let checkedExample = client.checkChar(cleanExample, 1700, ".");
        urbanEmbed
        .setAuthor("Urban Dictionary", "https://firebounty.com/image/635-urban-dictionary")
        .setURL(result.URL)
        .setTitle(`**Urban Dictionary** ${client.getEmoji("smugFace")}`)
        .setDescription(
        `${client.getEmoji("star")}**Word**: ${result.word}\n` +
        `${client.getEmoji("star")}**Author**: ${result.author ? result.author : "None"}\n` +
        `${client.getEmoji("star")}${client.getEmoji("up")} ${result.thumbsUp} ${client.getEmoji("down")} ${result.thumbsDown}\n` +
        `${client.getEmoji("star")}**Definition**: ${cleanDef ? cleanDef : "None"}\n` +
        `${client.getEmoji("star")}**Example**: ${checkedExample ? checkedExample : "None"}`
        )
        .setThumbnail(message.author.displayAvatarURL)
        message.channel.send(urbanEmbed);
        return;
    }
 
    let result = await urban.random()
        let cleanDef = result.definition.replace(/(\[|\])/g, "").replace(/(\r\n|\n|\r)/gm,"");
        let cleanExample = result.example.replace(/(\[|\])/g, "").replace(/(\r\n|\n|\r)/gm,"");
        let checkedExample = client.checkChar(cleanExample, 1700, ".");
        urbanEmbed
        .setAuthor("Urban Dictionary", "https://firebounty.com/image/635-urban-dictionary")
        .setURL(result.URL)
        .setTitle(`**Urban Dictionary** ${client.getEmoji("smugFace")}`)
        .setDescription(
        `${client.getEmoji("star")}**Word**: ${result.word}\n` +
        `${client.getEmoji("star")}**Author**: ${result.author ? result.author : "None"}\n` +
        `${client.getEmoji("star")}${client.getEmoji("up")} ${result.thumbsUp} ${client.getEmoji("down")} ${result.thumbsDown}\n` +
        `${client.getEmoji("star")}**Definition**: ${cleanDef ? cleanDef : "None"}\n` +
        `${client.getEmoji("star")}**Example**: ${checkedExample ? checkedExample : "None"}`
        )
        .setThumbnail(message.author.displayAvatarURL)
        message.channel.send(urbanEmbed);
}