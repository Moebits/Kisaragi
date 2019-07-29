exports.run = (client: any, message: any, args: string[]) => {

  let ownerID: any = process.env.OWNER_ID;
  const reloadEmbed: any = client.createEmbed();
  const commandName: string = args[1];
  const commandDir: string = args[2];

  if(!args[1]) {
    return message.channel.send(reloadEmbed
    .setDescription(`Correct usage is =>reload (command) (dir)`));
  }
    
  if(!client.commands.has(commandName)) {
    return message.channel.send(reloadEmbed
    .setDescription(`${commandName} does not exist`));
  }

  if (message.author.id === ownerID) {
    
    delete require.cache[require.resolve(`../${commandDir}/${commandName}.js`)];
      
    client.commands.delete(commandName);
    const fileName = require(`../${commandDir}/${commandName}.js`);
    client.commands.set(commandName, fileName);
    message.channel.send(reloadEmbed
    .setDescription(`The command **${commandName}** has been reloaded!`));
  } else {
    message.channel.send(reloadEmbed
        .setDescription("In order to use this command, you must be a bot owner."))
        return;
  }
}