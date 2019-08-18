exports.run = async (discord: any, message: any, args: string[]) => {
    const ascii = require("ascii-art");
    const asciiEmbed = discord.createEmbed();

    let text = discord.combineArgs(args, 1);
    if (!text) return;

    ascii.font(text, "Doom", asciiText => {
        asciiEmbed
        .setTitle(`**Ascii Art** ${discord.getEmoji("kannaSip")}`)
        .setDescription("```" + discord.checkChar(asciiText, 2000, "|") + "```")
        message.channel.send(asciiEmbed);
    });
}