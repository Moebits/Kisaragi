module.exports = async (client: any, message: any) => {

    require("../exports/functions.js")(client, message);
    require("../exports/settings.js")(client, message);
    require("../exports/queries")(client, message);
    let prefix: string = await client.fetchPrefix();

    //Add guild to database
    await client.initGuild();

    if (message.guild) {
      await client.calcScore();
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

    console.log(prefix);
 
    //Load Commands
    const args: any = message.content.slice(prefix.length).trim().split(/ +/g);
    if (args[0] === undefined) return;
    const command: string = args[0].toLowerCase();
    const rawCommand: any = await client.fetchCommand(command, "command"); 
    const rawPath: any = await client.fetchCommand(command, "path")
    const cmd = rawCommand[0].toString();
    if (cmd === null || undefined) return;
    const cp = require(`.${rawPath[0]}`);
    cp.run(client, message, args);
}

