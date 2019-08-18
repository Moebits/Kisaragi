import {Message} from "discord.js";

exports.run = async (discord: any, message: Message, args: string[]) => {
    const nekoClient = require('nekos.life');
    const neko = new nekoClient();

    let image;
    let title;
    if (args[1] === "gif") {
        image = await neko.sfw.nekoGif();
        title = "Neko Gif"
    } else if (args[1] === "lewd") {
        if (args[2] === "gif") {
            image = await neko.nsfw.nekoGif();
            title = "Lewd Neko Gif"
        } else {
            image = await neko.nsfw.neko();
            title = "Lewd Neko"
        }
    } else {
        image = await neko.sfw.neko();
        title = "Neko"
    }

    let nekoEmbed = discord.createEmbed();
    nekoEmbed
    .setAuthor("nekos.life", "https://avatars2.githubusercontent.com/u/34457007?s=200&v=4")
    .setURL(image.url)
    .setTitle(`**${title}** ${discord.getEmoji("madokaLewd")}`)
    .setImage(image.url)
    message.channel.send(nekoEmbed);
}