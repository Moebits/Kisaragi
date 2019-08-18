exports.run = async (discord: any, message: any, args: string[]) => {
    const nekoClient = require('nekos.life');
    const neko = new nekoClient();

    let image = await neko.sfw.baka();

    let bakaEmbed = discord.createEmbed();
    bakaEmbed
    .setAuthor("nekos.life", "https://avatars2.githubusercontent.com/u/34457007?s=200&v=4")
    .setURL(image.url)
    .setTitle(`**Baka** ${discord.getEmoji("chinoSmug")}`)
    .setImage(image.url)
    message.channel.send(bakaEmbed);
}