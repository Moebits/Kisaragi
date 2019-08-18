import {Message} from "discord.js";

exports.run = async (discord: any, message: Message, args: string[]) => {
    const nekoClient = require('nekos.life');
    const neko = new nekoClient();

    let image;
    let title;
    if (args[1] === "lewd") {
        if (args[2] === "ero") {
            image = await neko.nsfw.eroKitsune();
            title = "Lewd Ero Kitsune"
        } else {
            image = await neko.nsfw.kitsune();
            title = "Lewd Kitsune"
        }
    } else {
        image = await neko.sfw.foxGirl();
        title = "Kitsune"
    }

    let nekoEmbed = discord.createEmbed();
    nekoEmbed
    .setAuthor("nekos.life", "https://avatars2.githubusercontent.com/u/34457007?s=200&v=4")
    .setURL(image.url)
    .setTitle(`**${title}** ${discord.getEmoji("madokaLewd")}`)
    .setImage(image.url)
    message.channel.send(nekoEmbed);
}