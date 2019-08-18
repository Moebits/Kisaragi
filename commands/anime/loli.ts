import {Message} from "discord.js";

exports.run = async (discord: any, message: Message, args: string[]) => {
    const Loli = require('lolis.life');
    const loli = new Loli();
    const loliEmbed = discord.createEmbed();
    let result;

    if (args[1] === "hentai") {
        result = await loli.getNSFWLoli();
    } else {
        result = await loli.getSFWLoli();
    }

    loliEmbed
    .setTitle(`**Loli** ${discord.getEmoji("madokaLewd")}`)
    .setImage(result.url)
    message.channel.send(loliEmbed);
    console.log(result)
}