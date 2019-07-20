exports.run = async (client: any, message: any, args: string[]) => {
    const ascii = require("ascii-art");
    const asciiEmbed = client.createEmbed();

    let text = client.combineArgs(args, 1);
    if (!text) return;

    ascii.font(text, "Doom", asciiText => {
        asciiEmbed
        .setTitle(`**Ascii Art** ${client.getEmoji("kannaSip")}`)
        .setDescription("```" + client.checkChar(asciiText, 2000, "|") + "```")
        message.channel.send(asciiEmbed);
    });
}