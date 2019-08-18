exports.run = async (discord: any, message: any, args: string[]) => {
    
    const imgur = require('imgur');
    await imgur.setClientId(process.env.IMGUR_discord_ID);
    await imgur.setAPIUrl('https://api.imgur.com/3/');

    let query = discord.combineArgs(args, 1);
    let json = await imgur.search(query);
    let random = Math.floor(Math.random() * json.data.length)
    let image = json.data[random];
    if (!image) {   
        const imgurEmbed = discord.createEmbed();
        imgurEmbed
        .setAuthor("imgur", "https://i.imgur.com/kpLlF3Y.jpg")
        .setTitle(`**Imgur Search** ${discord.getEmoji("kannaWave")}`)
        .setDescription("No results were found! Try searching for a tag on the imgur website.\n" +
        "[Imgur Website](https://imgur.com/)")
        message.channel.send(imgurEmbed)
        return;
    } else if (image.images.length === 1) {   
        const imgurEmbed = discord.createEmbed();
        let extension;
        switch (image.images[0].type.slice(-3)) {
            case "mp4": extension = "gif"; break;
            case "peg": extension = "jpeg"; break;
            default: extension = image.images[0].type.slice(-3);
        }
        let cover = `https://imgur.com/${image.images[0].id}.${extension}`;
        imgurEmbed
        .setAuthor("imgur", "https://i.imgur.com/kpLlF3Y.jpg")
        .setURL(image.link)
        .setTitle(`**Imgur Search** ${discord.getEmoji("kannaWave")}`)
        .setDescription(
            `${discord.getEmoji("star")}_Title:_ **${image.title}**\n` +
            `${discord.getEmoji("star")}_Account:_ **${image.account_url}**\n` +
            `${discord.getEmoji("star")}**${image.ups}** ${discord.getEmoji("up")} **${image.downs}** ${discord.getEmoji("down")}\n` +
            `${discord.getEmoji("star")}_Views:_ **${image.views}**\n` +
            `${discord.getEmoji("star")}_Animated:_ **${image.images[0].animated ? "Yes" : "No"}**\n` +
            `${discord.getEmoji("star")}_Description:_ ${image.description ? image.description : "None"}\n`
        )
        .setImage(cover)
        message.channel.send(imgurEmbed);
        return;
    } else {
        let imageArray: any = [];
        for (let i = 0; i < image.images.length - 1; i++) {    
            console.log(i) 
            const imgurEmbed = discord.createEmbed();
            let extension;
            switch (image.images[i].type.slice(-3)) {
                case "mp4": extension = "gif"; break;
                case "peg": extension = "jpeg"; break;
                default: extension = image.images[i].type.slice(-3);
            }
            let cover = `https://imgur.com/${image.images[i].id}.${extension}`;
            imgurEmbed
            .setAuthor("imgur", "https://i.imgur.com/kpLlF3Y.jpg")
            .setURL(image.link)
            .setTitle(`**Imgur Search** ${discord.getEmoji("kannaWave")}`)
            .setDescription(
                `${discord.getEmoji("star")}_Title:_ **${image.title}**\n` +
                `${discord.getEmoji("star")}_Account:_ **${image.account_url}**\n` +
                `${discord.getEmoji("star")}**${image.ups}** ${discord.getEmoji("up")} **${image.downs}** ${discord.getEmoji("down")}\n` +
                `${discord.getEmoji("star")}_Views:_ **${image.views}**\n` +
                `${discord.getEmoji("star")}_Animated:_ **${image.images[i].animated ? "Yes" : "No"}**\n` +
                `${discord.getEmoji("star")}_Description:_ ${image.description ? image.description : "None"}\n`
            )
            .setImage(cover)
            console.log(image)
            imageArray.push(imgurEmbed);
        }
        discord.createReactionEmbed(imageArray);
    }
}