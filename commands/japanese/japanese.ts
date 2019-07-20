exports.run = async (client: any, message: any, args: string[]) => {

    const translate = require('@vitalets/google-translate-api');
    let translateText = client.combineArgs(args, 1);
    let translateEmbed = client.createEmbed();

    let result = await translate(translateText, {to: 'ja'});
    if (result.from.language.iso === 'ja') {
        let newResult = await translate(translateText, {to: 'en'});
        translateEmbed
        .setTitle(`**Translated Text** ${client.getEmoji("kannaCurious")}`)
        .setDescription(`${client.getEmoji("star")} ${newResult.text}`)
        message.channel.send(translateEmbed)
        return;
    }
    translateEmbed
    .setTitle(`**Translated Text** ${client.getEmoji("kannaCurious")}`)
    .setDescription(`${client.getEmoji("star")} ${result.text}`)
    message.channel.send(translateEmbed)
}