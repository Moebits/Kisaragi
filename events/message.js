const config = require("../config.json");
const prefix = config.prefix;

const responseObject = {
    "gab": "Gab is the best girl"
}

module.exports = (client, message) => {

    require("../modules/message-functions.js")(client, message);

    if (client.checkPrefixUser(message) === true) {
        return;
    }
    
    if (client.checkBotMention(message) === true) {
        return message.channel.send(prefixHelpEmbed);
    }

    if(responseObject[message.content]) {
        message.channel.send(responseObject[message.content]);
    }
    
    //Load Commands
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command);
    if (!cmd) return;

    if (talkedRecently.has(message.author.id)) {
        return;
    } else {
        talkedRecently.add(message.author.id);
        setTimeout(() => {
        talkedRecently.delete(message.author.id);
        }, 500);
    }

    cmd.run(client, message, args);
}

