exports.run = (client: any, message: any, args: string[]) => {

  const reloadEmbed: any = client.createEmbed();
  const commandName: string = args[0];
  const commandDir: string = args[1];

  if(!args[1]) {
    return message.channel.send(reloadEmbed
    .setDescription(`Correct usage is =>reload (command) (dir)`));
  }
    
  if(!client.commands.has(commandName)) {
    return message.channel.send(reloadEmbed
    .setDescription(`${commandName} does not exist`));
  }
    
  delete require.cache[require.resolve(`../${commandDir}/${commandName}.js`)];
    
  client.commands.delete(commandName);
  const fileName = require(`../${commandDir}/${commandName}.js`);
  client.commands.set(commandName, fileName);
  message.channel.send(reloadEmbed
  .setDescription(`The command **${commandName}** has been reloaded!`));
}