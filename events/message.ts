import {Collection} from "discord.js"
const cooldowns = new Collection();

module.exports = async (client: any, message: any) => {

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
    let commands = require("../../commands.json");
    let prefix: string = await client.fetchPrefix();

    /*let letterNames = [
      "PadoruPadoru"
    ]
  
    client.generateEmojis(letterNames)*/

    if (message.guild) {
      /*let blockedWords = await client.fetchColumn("blocks", "blocked words");
      if (blockedWords[0]) {
        if (blockedWords[0].some(word => message.content.includes(word))) {
          let badMsg = message.reply("Your message contains a blocked word!");
          message.delete();
          badMsg.delete(3000);
        }
      }*/
      let pointTimeout = await client.fetchColumn("points", "point timeout");
      setTimeout(() => {
        client.calcScore(message)
      }, pointTimeout[0]);
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
        return message.channel.send(responseObject[message.content.toLowerCase()]);
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

    if (message.content === '=>join') {
      client.emit('guildMemberAdd', message.member || await message.guild.fetchMember(message.author));
    }

    if (message.content === '=>bye') {
      client.emit('guildMemberRemove', message.member || await message.guild.fetchMember(message.author));
    }

    const args: string[] = message.content.slice(prefix.length).trim().split(/ +/g);
    if (args[0] === undefined) return;
    let cmd: string = args[0].toLowerCase();
    let path: string = await client.fetchCommand(cmd, "path");
    if1:
    if (!path) {
      for (let i in commands) {
        for (let j in commands[i].aliases) {
          if (commands[i].aliases[j] === cmd) {
            cmd = commands[i].name;
            path = await client.fetchCommand(cmd, "path");
            break if1;
          } 
        }
      }
    }
    if (!path) return;
    let cooldown: string[] = await client.fetchCommand(cmd, "cooldown");
    const cmdPath = require(path[0]);

    await require("../exports/images.js")(client, message);
    await require("../exports/collectors.js")(client, message);

    let onCooldown = client.cmdCooldown(cmd, cooldown.join(""), message, cooldowns);
    if (onCooldown) {
      message.channel.send(onCooldown);
      return;
    }
    
    let msg = await message.channel.send(`**Loading** ${client.getEmoji("gabCircle")}`);
    await cmdPath.run(client, message, args).then(() => {
    let msgCheck = message.channel.messages;
    if(msgCheck.has(msg.id)) msg.delete(1000)})
    .catch((err: any) => message.channel.send(client.cmdError(err)));
    
}

