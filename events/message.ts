module.exports = async (client: any, message: any) => {

    /*client.emojis.map((emoji: any) => {
      if (emoji.name === "gabCircle") {
        console.log(emoji.id);
      }
    });*/

    await require("../exports/functions.js")(client, message);
    await require("../exports/queries.js")(client, message);
    await require("../exports/images.js")(client, message);
    const commands = await require("../../commands.json");
    let prefix: string = await client.fetchPrefix();

    if (message.guild && typeof message != undefined) {
      setTimeout(() => {
        client.calcScore()
        .catch((error: any) => console.log(error));
      }, 100000);
    }

    const responseObject: any = {
      "gab": "Gab is the best girl",
      "I love you": `I love you more, <@${message.author.id}>!`,
      "F": "F",
      "owo": "uwu",
      "uwu": "owo"
    }

    if (responseObject[message.content]) {
      if (!message.author.bot) {
        return message.channel.send(responseObject[message.content]);
      }
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

    message.channel.send(`**Loading** ${client.getEmoji("gabCircle")}`)
    .then(async (msg: any) => {
      try {
      await cp.run(client, message, args);
      msg.delete(5000);
      } catch (error) {
        client.cmdError(error);
    }
    });
}

