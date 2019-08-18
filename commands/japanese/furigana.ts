import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

exports.run = async (discord: any, message: any, args: string[]) => {
    const kuroshiro = new Kuroshiro();
    await kuroshiro.init(new KuromojiAnalyzer());

    let input = discord.combineArgs(args, 1);
    let result = await kuroshiro.convert(input, {mode: "furigana", to: "hiragana"});
    let cleanResult = result.replace(/<\/?[^>]+(>|$)/g, "");

    let furiganaEmbed = discord.createEmbed();
    furiganaEmbed
    .setAuthor("kuroshiro", "https://kuroshiro.org/kuroshiro.png")
    .setTitle(`**furigana Conversion** ${discord.getEmoji("kannaSip")}`)
    .setDescription(`${discord.getEmoji("star")}${cleanResult}`);
    message.channel.send(furiganaEmbed);
}