module.exports = (client: any, message: any) => {

    require("../exports/functions.js")(client, message);
    require("../exports/settings.js")(client, message);
    let config: any = require("../../config.json");
    let prefix: string = config.prefix;

    //const database = require('../database.js');

    //Add guild to database
    if (message.guild) {
      if (!client.fetchGuild()) {
        client.initAll();
      } 
    }

    /*if (message.guild) {
        let score: any = client.getScore.get(message.author.id, message.guild.id);
        if (!score) {
            score = {
              id: `${message.guild.id}-${message.author.id}`,
              user: message.author.id,
              guild: message.guild.id,
              points: 0,
              level: 0
            }
          }

        score.points = Math.floor(score.points + client.getRandomNum(10, 20));
        const curLevel: number = Math.floor(score.points / 1000);

        if (score.points < 1000) {
          score.level === 0;
        }

        if(score.level < curLevel) {
        score.level++;
        message.reply(`You've leveled up to level **${curLevel}**!`);
        }
        //Log score to database here
      }*/

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
    if (args.shift() === undefined) return;
    const command: string = args.shift()!.toLowerCase();
    const cmd: any = client.commands.get(command); //Find command from database
    if (!cmd) return;

    cmd.run(client, message, args);
}

