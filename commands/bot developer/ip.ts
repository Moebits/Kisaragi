exports.run = async (client: any, message: any, args: string[]) => {
    const ip = require("ip");
    let ipEmbed = client.createEmbed();

    if (client.checkBotOwner()) {
        let result = ip.address();
        ipEmbed
        .setTitle(`**IP Address** ${client.getEmoji("vigneDead")}`)
        .setDescription(`My IP Address is ${result}`)
        message.channel.send(ipEmbed);
    } else {
        message.channel.send(ipEmbed
            .setDescription("In order to use this command, you must be the bot developer."))
            return;
    }
    
}