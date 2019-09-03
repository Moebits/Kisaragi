import {Collection} from "discord.js"
const cooldowns = new Collection();

module.exports = async (discord: any, message: any) => {

  /*let guildIDs = [
    "594616328351121419"
  ]
  for (let i in guildIDs) {
    let guild = discord.guilds.find(g => guildIDs[i] === g.id.toString())
    await guild.delete()
  }*/
  
    await require("../exports/functions.js")(discord, message);
    await require("../exports/queries.js")(discord, message);
    await require("../exports/links.js")(discord, message);
    await require("../exports/detection.js")(discord, message);
    let commands = require("../../commands.json");
    let prefix: string = await discord.fetchPrefix();

    /*let letterNames = [
      ""
    ]
  
    discord.generateEmojis(letterNames)*/

    if (message.guild) {
      let pointTimeout = await discord.fetchColumn("points", "point timeout");
      setTimeout(() => {
        discord.calcScore(message)
      }, pointTimeout[0] ? pointTimeout[0] : 60000);
      discord.block(message);
      discord.detectAnime(message);
      discord.swapRoles(message);
      discord.haiku(message);
      discord.autoCommand(message);
    }

    const responseObject: any = {
      "kisaragi": "Kisaragi is the best girl!",
      "f": `${discord.letters("F")}`,
      "e": `${discord.letters("E")}`,
      "owo": "owo",
      "uwu": "uwu",
      "rip": `${discord.getEmoji("rip")}`
    }

    if (responseObject[message.content.toLowerCase()]) {
      if (!message.author.bot) {
        return message.channel.send(responseObject[message.content.toLowerCase()]);
      }
    }

    if (message.content.toLowerCase() === "i love you") {
      if (message.author.id === process.env.OWNER_ID) {
        message.channel.send(`I love you more, <@${message.author.id}>!`);
      } else {
        message.channel.send(`Sorry <@${message.author.id}>, but I don't share the same feelings. We can still be friends though!`);
      }
    }

    if (discord.checkBotMention(message)) {
        const prefixHelpEmbed: any = discord.createEmbed();
        prefixHelpEmbed
        .setDescription(`My prefix is set to "${prefix}  "!\nType ${prefix}help if you need help.`)
        message.channel.send(prefixHelpEmbed);
    }

    if (message.content.startsWith("https")) {
      await discord.postLink(message);
      return;
    }

    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args: string[] = message.content.slice(prefix.length).trim().split(/ +/g);
    if (args[0] === undefined) return;
    let cmd: string = args[0].toLowerCase();
    let path: string = await discord.fetchCommand(cmd, "path");
    if1:
    if (!path) {
      for (let i in commands) {
        for (let j in commands[i].aliases) {
          if (commands[i].aliases[j] === cmd) {
            cmd = commands[i].name;
            path = await discord.fetchCommand(cmd, "path");
            break if1;
          } 
        }
      }
    }
    if (!path) return;
    let cooldown: string[] = await discord.fetchCommand(cmd, "cooldown");
    const cmdPath = require(path[0]);

    await require("../exports/images.js")(discord, message);
    await require("../exports/collectors.js")(discord, message);

    let onCooldown = discord.cmdCooldown(cmd, cooldown.join(""), message, cooldowns);
    if (onCooldown) {
      message.channel.send(onCooldown);
      return;
    }
    
    let msg = await message.channel.send(`**Loading** ${discord.getEmoji("gabCircle")}`);
    cmdPath.run(discord, message, args).then(() => {
    let msgCheck = message.channel.messages;
    if(msgCheck.has(msg.id)) msg.delete(1000)})
    .catch((err: any) => message.channel.send(discord.cmdError(err)));
    
}

