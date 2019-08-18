exports.run = async (discord: any, message: any, args: string[]) => {
    const nasa = require('nasa-sdk');
    nasa.setNasaApiKey(process.env.NASA_API_KEY);
    let nasaEmbed = discord.createEmbed();

    let data = await nasa.APOD.fetch();
    let checkedMessage = discord.checkChar(data.explanation, 1900, ".");
    nasaEmbed
    .setAuthor("nasa", "https://cdn.mos.cms.futurecdn.net/baYs9AuHxx9QXeYBiMvSLU.jpg")
    .setTitle(`**Nasa Picture** ${discord.getEmoji("cute")}`)
    if (data.media_type === 'video') nasaEmbed.setURL("**Link**", data.url)
    .setDescription(
    `${discord.getEmoji("star")}_Title:_ **${data.title}**\n` +
    `${discord.getEmoji("star")}_Date:_ **${discord.formatDate(data.date)}**\n` +
    `${discord.getEmoji("star")}_Explanation:_ **${checkedMessage}**\n` 
    )
    .setImage(data.url)
    .setThumbnail(message.author.displayAvatarURL)
    message.channel.send(nasaEmbed);
}