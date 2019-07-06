exports.run = (client: any, message: any, newPrefix: string) => {

    let config: any = require("../../../config.json");

    config.prefix = newPrefix;

    const prefixEmbed: any = client.createEmbed();
    prefixEmbed
    .setDescription("The prefix has been changed to " + newPrefix + "\n" + "If you ever forget the prefix just tag me!")
    message.channel.send(prefixEmbed)
    
}