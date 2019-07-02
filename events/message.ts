const responseObject = {
    "gab": "Gab is the best girl"
}

module.exports = (client, message) => {

    require("../modules/message-functions.js")(client, message);

    let config = require("../../config.json");
    let prefix = config.prefix;

    if (client.checkBotMention(message)) {
        const prefixHelpEmbed = client.createEmbed();
        prefixHelpEmbed
        .setDescription(`My prefix is set to "${prefix}"!\nType ${prefix}help if you need help.`)
        message.channel.send(prefixHelpEmbed);
    }

    if (client.checkPrefixUser(message)) {
        return;
    }

    if(responseObject[message.content]) {
        return message.channel.send(responseObject[message.content]);
    }
    
    //Load Commands
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command);
    if (!cmd) return;

    cmd.run(client, message, args);
}

