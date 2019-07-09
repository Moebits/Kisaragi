import {Client, Message} from "discord.js";

module.exports = async (client: Client, message: Message) => {

    const functions = await require("../exports/functions.js")(client, message);
    const queries = await require("../exports/queries.js")(client, message);
    const commands = await require("../commands.json");
    let prefix: string = await queries.fetchPrefix();

    if (message.guild) {
      functions.calcScore();

        const responseObject: any = {
          "gab": "Gab is the best girl"
      }
      if (responseObject[message.content]) {
        return message.channel.send(responseObject[message.content]);
      }
      if (functions.checkBotMention(message)) {
          const prefixHelpEmbed: any = functions.createEmbed();
          prefixHelpEmbed
          .setDescription(`My prefix is set to "${prefix}"!\nType ${prefix}help if you need help.`)
          message.channel.send(prefixHelpEmbed);
      }
      if (functions.checkPrefixUser(message)) {
          return;
      }

    }

    //Load Commands
    const args: string[] = message.content.slice(prefix.length).trim().split(/ +/g);
    if (args[0] === undefined) return;
    const command: string = args[0].toLowerCase();
    const path: string = commands.path[command];
    if (path === null || undefined) return;
    const cp = require(path);

    message.channel.send("Loading")
    .then(async (msg: any) => {
      await cp.run(client, message, args);
      msg.delete(1000);
    });
}

