"use strict";
module.exports = (client, message) => {
    require("../exports/functions.js")(client, message);
    require("../exports/settings.js")(client, message);
    let config = require("../../config.json");
    let prefix = config.prefix;
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
    const responseObject = {
        "gab": "Gab is the best girl"
    };
    if (responseObject[message.content]) {
        return message.channel.send(responseObject[message.content]);
    }
    if (client.checkBotMention(message)) {
        const prefixHelpEmbed = client.createEmbed();
        prefixHelpEmbed
            .setDescription(`My prefix is set to "${prefix}"!\nType ${prefix}help if you need help.`);
        message.channel.send(prefixHelpEmbed);
    }
    if (client.checkPrefixUser(message)) {
        return;
    }
    //Load Commands
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    if (args.shift() === undefined)
        return;
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command); //Find command from database
    if (!cmd)
        return;
    cmd.run(client, message, args);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2V2ZW50cy9tZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxNQUFNLENBQUMsT0FBTyxHQUFHLENBQUMsTUFBVyxFQUFFLE9BQVksRUFBRSxFQUFFO0lBRTNDLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNwRCxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbkQsSUFBSSxNQUFNLEdBQVEsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDL0MsSUFBSSxNQUFNLEdBQVcsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUVuQyw2Q0FBNkM7SUFFN0MsdUJBQXVCO0lBQ3ZCLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRTtRQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUFFO1lBQ3hCLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNsQjtLQUNGO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztTQXdCSztJQUVMLE1BQU0sY0FBYyxHQUFRO1FBQ3hCLEtBQUssRUFBRSxzQkFBc0I7S0FDaEMsQ0FBQTtJQUNELElBQUksY0FBYyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUNuQyxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztLQUM5RDtJQUVELElBQUksTUFBTSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUNqQyxNQUFNLGVBQWUsR0FBUSxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbEQsZUFBZTthQUNkLGNBQWMsQ0FBQyx3QkFBd0IsTUFBTSxZQUFZLE1BQU0sd0JBQXdCLENBQUMsQ0FBQTtRQUN6RixPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztLQUN6QztJQUVELElBQUksTUFBTSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUNqQyxPQUFPO0tBQ1Y7SUFFRCxlQUFlO0lBQ2YsTUFBTSxJQUFJLEdBQWEsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoRixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxTQUFTO1FBQUUsT0FBTztJQUN2QyxNQUFNLE9BQU8sR0FBVyxJQUFJLENBQUMsS0FBSyxFQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDcEQsTUFBTSxHQUFHLEdBQVEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyw0QkFBNEI7SUFDM0UsSUFBSSxDQUFDLEdBQUc7UUFBRSxPQUFPO0lBRWpCLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNuQyxDQUFDLENBQUEifQ==