const responseObject = {
    "gab": "Gab is the best girl"
}

module.exports = (client, message) => {

    require("../modules/message-functions.ts")(client, message);

    if (client.checkPrefixUser(message) === true) {
        return;
    }
    
    if (client.checkBotMention(message) === true) {
        return message.channel.send(client.prefixHelpEmbed());
    }

    if(responseObject[message.content]) {
        message.channel.send(responseObject[message.content]);
    }
    
    //Load Commands
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command);
    if (!cmd) return;

    cmd.run(client, message, args);
}

