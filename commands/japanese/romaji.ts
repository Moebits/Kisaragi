exports.run = async (client: any, message: any, args: string[]) => {
    const {Kuroshiro} = require("kuroshiro");
    const kuroshiro = new Kuroshiro();
    const {KuromojiAnalyzer} = require("kuroshiro-analyzer-kuromoji.js");
    await kuroshiro.init(new KuromojiAnalyzer());

    let input = client.combineArgs(args, 1);
    let result = await kuroshiro.convert(input, {mode: "spaced", to: "romaji"});

    let romajiEmbed = client.createEmbed();
    romajiEmbed
    .setAuthor("kuroshiro", "https://kuroshiro.org/kuroshiro.png")
    .setTitle(`**Romaji Conversion** ${client.getEmoji("kannaSip")}`)
    .setDescription(`${client.getEmoji("star")}${result}`);
    message.channel.send(romajiEmbed);
}