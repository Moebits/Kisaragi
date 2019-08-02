import {Message} from "discord.js";

exports.run = async (client: any, message: Message, args: string[]) => {
    const Loli = require('lolis.life');
    const loli = new Loli();
    const loliEmbed = client.createEmbed();
    let result;

    if (args[1] === "hentai") {
        result = await loli.getNSFWLoli();
    } else {
        result = await loli.getSFWLoli();
    }

    loliEmbed
    .setAuthor("lolis.life")
    .setTitle(`**Loli** ${client.getEmoji("madokaLewd")}`)
    .setImage(result)
    message.channel.send(loliEmbed);
    console.log(result)
}