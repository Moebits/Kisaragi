exports.run = async (client, message, args) => {

  const roleEmbed = client.createEmbed();

  if (!args[2]) {
    message.channel.send(roleEmbed
      .setDescription("Correct usage is =>role <add> <del> [user] [role]"));
      return;
  } else {

      switch (args[0]) {
        case 'add': {
          
          if (message.mentions.members.size === 0) return message.channel.send(`<@${message.author.id}>, Please mention a user to give the role to.`);
          const member = message.mentions.members.first();
          const name = client.combineArgs(args, 2);
          // Find the role on the guild.
          const role = message.guild.roles.find(r => r.name === name);
          // End the command if the bot cannot find the role on the server.
          if (!role) return message.reply('I can\'t seem to find that role.');
          try {
            await member.addRole(role);
            await message.channel.send(`I've added the ${name} role to ${member.displayName}.`);
          } catch (e) {
            console.log(e);
          }
          break;
        }
    
        case 'remove': {
          // Check if the message mentions a user.
          if (message.mentions.members.size === 0) return message.reply('Please mention a user to take the role from.');
          const member = message.mentions.members.first();
          // This is the name of the role. For example, if you do 'role -remove @York#2400 The Idiot Himself', the name of the role would be 'The Idiot Himself'.
          const name = args.slice(1).join(' ');
          // Find the role on the guild.
          const role = message.guild.roles.find(r => r.name === name);
          // End the command if the bot cannot find the role on the server.
          if (!role) return message.reply('I can\'t seem to find that role.');
          try {
            await member.removeRole(role);
            await message.channel.send(`I've removed the ${name} role from ${member.displayName}.`);
          } catch (e) {
            console.log(e);
          }
        }
      }
    }
  };
  