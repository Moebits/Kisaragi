exports.run = async (client: any, message: any, args: string[]) => {
    const nasa = require('nasa-sdk');
    nasa.setNasaApiKey(process.env.NASA_API_KEY);
    let nasaEmbed = client.createEmbed();

    let data = await nasa.APOD.fetch();
    let checkedMessage = client.checkChar(data.explanation, 1900, ".");
    nasaEmbed
    .setAuthor("nasa", "https://cdn.mos.cms.futurecdn.net/baYs9AuHxx9QXeYBiMvSLU.jpg")
    .setTitle(`**Nasa Picture** ${client.getEmoji("cute")}`)
    if (data.media_type === 'video') nasaEmbed.setURL("**Link**", data.url)
    .setDescription(
    `${client.getEmoji("star")}_Title:_ **${data.title}**\n` +
    `${client.getEmoji("star")}_Date:_ **${client.formatDate(data.date)}**\n` +
    `${client.getEmoji("star")}_Explanation:_ **${checkedMessage}**\n` 
    )
    .setImage(data.url)
    .setThumbnail(message.author.displayAvatarURL)
    message.channel.send(nasaEmbed);
}