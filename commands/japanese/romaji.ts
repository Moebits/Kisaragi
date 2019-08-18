import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

exports.run = async (discord: any, message: any, args: string[]) => {
    const kuroshiro = new Kuroshiro();
    await kuroshiro.init(new KuromojiAnalyzer());

    let input = discord.combineArgs(args, 1);
    let result = await kuroshiro.convert(input, {mode: "spaced", to: "romaji"});
    let cleanResult = result.replace(/<\/?[^>]+(>|$)/g, "");

    let romajiEmbed = discord.createEmbed();
    romajiEmbed
    .setAuthor("kuroshiro", "https://kuroshiro.org/kuroshiro.png")
    .setTitle(`**Romaji Conversion** ${discord.getEmoji("kannaSip")}`)
    .setDescription(`${discord.getEmoji("star")}${cleanResult}`);
    message.channel.send(romajiEmbed);
}