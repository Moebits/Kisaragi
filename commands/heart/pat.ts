exports.run = async (client: any, message: any, args: string[]) => {
    const nekoClient = require('nekos.life');
    const neko = new nekoClient();

    let image = await neko.sfw.pat();

    let patEmbed = client.createEmbed();
    patEmbed
    .setAuthor("nekos.life", "https://avatars2.githubusercontent.com/u/34457007?s=200&v=4")
    .setURL(image.url)
    .setTitle(`**Pat** ${client.getEmoji("chinoSmug")}`)
    .setImage(image.url)
    message.channel.send(patEmbed);
}