exports.run = async (discord: any, message: any, args: string[]) => {

    const translate = require('@vitalets/google-translate-api');
    let translateText = discord.combineArgs(args, 1);
    let translateEmbed = discord.createEmbed();

    let result = await translate(translateText, {to: 'ja'});
    if (result.from.language.iso === 'ja') {
        let newResult = await translate(translateText, {to: 'en'});
        translateEmbed
        .setTitle(`**Translated Text** ${discord.getEmoji("kannaCurious")}`)
        .setDescription(`${discord.getEmoji("star")} ${newResult.text}`)
        message.channel.send(translateEmbed)
        return;
    }
    translateEmbed
    .setTitle(`**Translated Text** ${discord.getEmoji("kannaCurious")}`)
    .setDescription(`${discord.getEmoji("star")} ${result.text}`)
    message.channel.send(translateEmbed)
}