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
  
    await require("../exports/functions.js")(client, message);
    await require("../exports/queries.js")(client, message);
    await require("../exports/links.js")(client, message);
    await require("../exports/detection.js")(client, message);
    let commands = require("../../commands.json");
    let prefix: string = await client.fetchPrefix();

    /*let letterNames = [
      ""
    ]
  
    client.generateEmojis(letterNames)*/

    if (message.guild) {
      let pointTimeout = await client.fetchColumn("points", "point timeout");
      setTimeout(() => {
        client.calcScore(message)
      }, pointTimeout[0] ? pointTimeout[0] : 60000);
      client.block(message);
      client.detectAnime(message);
      client.swapRoles(message);
      client.haiku(message);
      client.autoCommand(message);
    }

    const responseObject: any = {
      "kisaragi": "Kisaragi is the best girl!",
      "f": "F",
      "owo": "owo",
      "uwu": "uwu",
      "rip": `${client.getEmoji("rip")}`
    }

    if (responseObject[message.content.toLowerCase()]) {
      if (!message.author.bot) {
        return message.channel.send(responseObject[message.content.toLowerCase()]);
      }
    }

    if (message.content.toLowerCase() === "i love you") {
      if (message.author.id === "174261874362155010") {
        message.channel.send(`I love you more, <@${message.author.id}>!`);
      } else {
        message.channel.send(`Sorry <@${message.author.id}>, but I don't share the same feelings. We can still be friends though!`);
      }
    }

    if (client.checkBotMention(message)) {
        const prefixHelpEmbed: any = client.createEmbed();
        prefixHelpEmbed
        .setDescription(`My prefix is set to "${prefix}  "!\nType ${prefix}help if you need help.`)
        message.channel.send(prefixHelpEmbed);
    }

    if (message.content.startsWith("https")) {
      await client.postLink(message);
      return;
    }

    if(!message.content.startsWith(prefix) || message.author.bot) return;

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
    cmdPath.run(client, message, args).then(() => {
    let msgCheck = message.channel.messages;
    if(msgCheck.has(msg.id)) msg.delete(1000)})
    .catch((err: any) => message.channel.send(client.cmdError(err)));
    
}

