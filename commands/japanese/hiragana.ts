exports.run = async (client: any, message: any, args: string[]) => {
    const {Kuroshiro} = require("kuroshiro");
    const kuroshiro = new Kuroshiro();
    const {KuromojiAnalyzer} = require("kuroshiro-analyzer-kuromoji");
    await kuroshiro.init(new KuromojiAnalyzer());

    let input = client.combineArgs(args, 1);
    let result = await kuroshiro.convert(input, {mode: "spaced", to: "hiragana"});

    let hiraganaEmbed = client.createEmbed();
    hiraganaEmbed
    .setAuthor("kuroshiro", "https://kuroshiro.org/kuroshiro.png")
    .setTitle(`**Hiragana Conversion** ${client.getEmoji("kannaSip")}`)
    .setDescription(`${client.getEmoji("star")}${result}`);
    message.channel.send(hiraganaEmbed);
}