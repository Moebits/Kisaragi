module.exports = async (client: any, message: any) => {

    require("../exports/functions.js")(client, message);
    require("../exports/queries.js")(client, message);
    const commands = await require("../../commands.json");
    let prefix: string = await client.fetchPrefix();

    if (message.guild) {
      setTimeout(() => {
        client.calcScore();
      }, 100000);
    }

    const responseObject: any = {
      "gab": "Gab is the best girl"
    }

    if (responseObject[message.content]) {
      return message.channel.send(responseObject[message.content]);
    }

    if (client.checkBotMention(message)) {
        const prefixHelpEmbed: any = client.createEmbed();
        prefixHelpEmbed
        .setDescription(`My prefix is set to "${prefix}"!\nType ${prefix}help if you need help.`)
        message.channel.send(prefixHelpEmbed);
    }

    if (client.checkPrefixUser(message)) {
        return;
    }

    //Load Commands
    const args: string[] = message.content.slice(prefix.length).trim().split(/ +/g);
    if (args[0] === undefined) return;
    const cmd: string = args[0].toLowerCase();
    const path: string = commands.paths[cmd];
    if (path === null || undefined) return;
    const cp = require(path);

    message.channel.send("Loading")
    .then(async (msg: any) => {
      await cp.run(client, message, args);
      msg.delete(1000);
    });
}

