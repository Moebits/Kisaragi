exports.run = (client, message, args) => {

  const reloadEmbed = client.createEmbed();
  const commandName = args[0];
  const commandDir = args[1];

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
  const props = require(`../${commandDir}/${commandName}.js`);
  client.commands.set(commandName, props);
  message.channel.send(reloadEmbed
  .setDescription(`The command **${commandName}** has been reloaded!`));
}