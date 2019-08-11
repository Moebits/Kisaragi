exports.run = async (client: any, message: any, args: string[]) => {
    const wiki = require("wikijs").default;
    let fs = require('fs');
    let svg2img = require('svg2img');
    let {Attachment} = require("discord.js");

    let wikipedia = wiki();

    let title;
    if (!args[1]) {
        title = await wikipedia.random(1);
    } else {
        let query = client.combineArgs(args, 1);
        let result = await wikipedia.search(query, 1);
        title = result.results;
    }

    let page = await wikipedia.page(title[0]);

    let summary = await page.summary();
    let mainImg = await page.mainImage();

    if (mainImg.slice(-3) === "svg") {
        await svg2img(mainImg, function(error, buffer) {
                fs.writeFileSync("../assets/images/wiki.png", buffer);
        });

        await client.timeout(500);

        let attachment = await new Attachment("../assets/images/wiki.png");

        let wikiEmbed = client.createEmbed();
        wikiEmbed
        .setAuthor("wikipedia", "https://s3.amazonaws.com/static.graphemica.com/glyphs/i500s/000/010/228/original/0057-500x500.png")
        .setTitle(`**Wikipedia Article** ${client.getEmoji("raphi")}`)
        .setURL(page.raw.fullurl)
        .attachFiles([attachment.file])
        .setImage(`attachment://wiki.png`)
        .setThumbnail("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiFv5c96eAMFjLxlSiE9F5GYKgzrMBPlUygB9vZzOUetVipzIe")
        .setDescription(
            `${client.getEmoji("star")}_Title:_ **${page.raw.title}**\n` +
            `${client.getEmoji("star")}_Last Revision:_ **${client.formatDate(page.raw.touched)}**\n` +
            `${client.getEmoji("star")}_Summary:_ ${client.checkChar(summary, 1800, ".")}\n` 
        )
        message.channel.send(wikiEmbed);

    } else {

        let wikiEmbed = client.createEmbed();
        wikiEmbed
        .setAuthor("wikipedia", "https://s3.amazonaws.com/static.graphemica.com/glyphs/i500s/000/010/228/original/0057-500x500.png")
        .setTitle(`**Wikipedia Article** ${client.getEmoji("raphi")}`)
        .setURL(page.raw.fullurl)
        .setImage(mainImg)
        .setThumbnail("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiFv5c96eAMFjLxlSiE9F5GYKgzrMBPlUygB9vZzOUetVipzIe")
        .setDescription(
            `${client.getEmoji("star")}_Title:_ **${page.raw.title}**\n` +
            `${client.getEmoji("star")}_Last Revision:_ **${client.formatDate(page.raw.touched)}**\n` +
            `${client.getEmoji("star")}_Summary:_ ${client.checkChar(summary, 1800, ".")}\n` 
        )
        message.channel.send(wikiEmbed);

    }
    

    
}