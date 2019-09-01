exports.run = async (discord: any, message: any, args: string[]) => {
    if (discord.checkBotDev(message)) return;
    const ip = require("ip");
    let ipEmbed = discord.createEmbed();
        let result = ip.address();
        ipEmbed
        .setTitle(`**IP Address** ${discord.getEmoji("vigneDead")}`)
        .setDescription(`My IP Address is ${result}`)
        message.channel.send(ipEmbed);
    
}