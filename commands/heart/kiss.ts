exports.run = async (discord: any, message: any, args: string[]) => {
    const nekoClient = require('nekos.life');
    const neko = new nekoClient();

    let image = await neko.sfw.kiss();

    let kissEmbed = discord.createEmbed();
    kissEmbed
    .setAuthor("nekos.life", "https://avatars2.githubusercontent.com/u/34457007?s=200&v=4")
    .setURL(image.url)
    .setTitle(`**Kiss** ${discord.getEmoji("chinoSmug")}`)
    .setImage(image.url)
    message.channel.send(kissEmbed);
}