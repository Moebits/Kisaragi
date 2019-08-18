exports.run = async (discord: any, message: any, args: string[]) => {
    const nekoClient = require('nekos.life');
    const neko = new nekoClient();

    let image = await neko.sfw.smug();

    let smugEmbed = discord.createEmbed();
    smugEmbed
    .setAuthor("nekos.life", "https://avatars2.githubusercontent.com/u/34457007?s=200&v=4")
    .setURL(image.url)
    .setTitle(`**Smug** ${discord.getEmoji("chinoSmug")}`)
    .setImage(image.url)
    message.channel.send(smugEmbed);
}