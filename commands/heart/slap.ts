exports.run = async (client: any, message: any, args: string[]) => {
    const nekoClient = require('nekos.life');
    const neko = new nekoClient();

    let image = await neko.sfw.slap();

    let slapEmbed = client.createEmbed();
    slapEmbed
    .setAuthor("nekos.life", "https://avatars2.githubusercontent.com/u/34457007?s=200&v=4")
    .setURL(image.url)
    .setTitle(`**Slap** ${client.getEmoji("chinoSmug")}`)
    .setImage(image.url)
    message.channel.send(slapEmbed);
}