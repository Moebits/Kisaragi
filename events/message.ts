module.exports = async (client: any, message: any) => {

  /*let letterNames = [
    "gdStar", "gdCoin", "gdUserCoin", "gdDiamond", "gdCP", "gdDemon"
  ]

  for (let i = 0; i < letterNames.length; i++) {
    client.emojis.map((emoji: any) => {
      if (emoji.name === letterNames[i]) {
        console.log(`{"name": "${letterNames[i]}", "id": "${emoji.id}"},`);
      }
    });
  } */

  /*let guildIDs = [
    "594616328351121419"
  ]
  for (let i in guildIDs) {
    let guild = client.guilds.find(g => guildIDs[i] === g.id.toString())
    await guild.delete()
  }*/
  
    /*let tc = await client.channels.get("580542336560398367");
    let ms = await tc.fetchMessage('600715814420873216');
    console.log(ms.attachments.map((a:any) => a.url))*/

    await require("../exports/functions.js")(client, message);
    await require("../exports/queries.js")(client, message);
    await require("../exports/links.js")(client, message);
    let prefix: string = await client.fetchPrefix();

    if (message.guild) {
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

    if (message.content.startsWith("https")) {
      await client.postLink(message);
      return;
    }

    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args: string[] = message.content.slice(prefix.length).trim().split(/ +/g);
    if (args[0] === undefined) return;
    const cmd: string = args[0].toLowerCase();
    //const path: string = commands.paths[cmd];
    const path: string = await client.fetchCommand(cmd, "path");
    if (path === null || undefined) return;
    const cp = require(path[0]);

    
    await require("../exports/images.js")(client, message);

    let msg = await message.channel.send(`**Loading** ${client.getEmoji("gabCircle")}`);
    await cp.run(client, message, args).catch((err) => message.channel.send(client.cmdError(err)));
    msg.delete(1000);
    
}

