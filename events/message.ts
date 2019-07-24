module.exports = async (client: any, message: any) => {

  /*let letterNames = [
    "300hit", "100hit",
    "50hit"
  ]

  for (let i = 0; i < letterNames.length; i++) {
    client.emojis.map((emoji: any) => {
      if (emoji.name === letterNames[i]) {
        console.log(`{"name": "${letterNames[i]}", "id": "${emoji.id}"},`);
      }
    });
  } */
  
    /*let tc = await client.channels.get("580542336560398367");
    let ms = await tc.fetchMessage('600715814420873216');
    console.log(ms.attachments.map((a:any) => a.url))*/


    await require("../exports/functions.js")(client, message);
    await require("../exports/queries.js")(client, message);
    const commands = await require("../../commands.json");
    let prefix: string = await client.fetchPrefix();

    if (message.guild && typeof message != undefined) {
      setTimeout(() => {
        client.calcScore()
        .catch((error: any) => console.log(error));
      }, 100000);
    }

    const responseObject: any = {
      "kisaragi": "Kisaragi is the best girl!",
      "i love you": `I love you more, <@${message.author.id}>!`,
      "f": "F",
      "owo": "owo",
      "uwu": "uwu",
      "e": "E"
    }

    if (responseObject[message.content.toLowerCase()]) {
      if (!message.author.bot) {
        return message.channel.send(client.letters(responseObject[message.content.toLowerCase()]));
      }
    }

    if (client.checkBotMention(message)) {
        const prefixHelpEmbed: any = client.createEmbed();
        prefixHelpEmbed
        .setDescription(`My prefix is set to "${prefix}"!\nType ${prefix}help if you need help.`)
        message.channel.send(prefixHelpEmbed);
    }

    if(!message.content.startsWith(prefix) || message.author.bot) return;

    console.log(message);

    const args: string[] = message.content.slice(prefix.length).trim().split(/ +/g);
    if (args[0] === undefined) return;
    const cmd: string = args[0].toLowerCase();
    const path: string = commands.paths[cmd];
    if (path === null || undefined) return;
    const cp = require(path);

    
    await require("../exports/images.js")(client, message);

    let msg = await message.channel.send(`**Loading** ${client.getEmoji("gabCircle")}`);
    cp.run(client, message, args).catch((err) => message.channel.send(client.cmdError(err)));
    msg.delete(1000);
    
}

