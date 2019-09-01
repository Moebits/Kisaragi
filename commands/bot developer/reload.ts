exports.run = (discord: any, message: any, args: string[]) => {

  if (discord.checkBotDev(message)) return;
  const reloadEmbed: any = discord.createEmbed();
  const commandName: string = args[1];
  const commandDir: string = args[2];

  if(!args[1]) {
    return message.channel.send(reloadEmbed
    .setDescription(`Correct usage is =>reload (command) (dir)`));
  }
    
  if(!discord.commands.has(commandName)) {
    return message.channel.send(reloadEmbed
    .setDescription(`${commandName} does not exist`));
  }

    
    delete require.cache[require.resolve(`../${commandDir}/${commandName}.js`)];
      
    discord.commands.delete(commandName);
    const fileName = require(`../${commandDir}/${commandName}.js`);
    discord.commands.set(commandName, fileName);
    message.channel.send(reloadEmbed
    .setDescription(`The command **${commandName}** has been reloaded!`));
}