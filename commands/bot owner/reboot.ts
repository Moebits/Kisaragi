const unloadCommand = async (commandName) => {
  let command;
  if (client.commands.has(commandName)) {
    command = client.commands.get(commandName);
  } else if (client.aliases.has(commandName)) {
    command = client.commands.get(client.aliases.get(commandName));
  }
  if (!command) return `The command \`${commandName}\` doesn't seem to exist, nor is it an alias. Try again!`;

  if (command.shutdown) {
    await command.shutdown(client);
  }
  const mod = require.cache[require.resolve(`../commands/$${commandName}`)];
  delete require.cache[require.resolve(`../commands/${commandName}.js`)];
  for (let i = 0; i < mod.parent.children.length; i++) {
    if (mod.parent.children[i] === mod) {
      mod.parent.children.splice(i, 1);
      break;
    }
  }
  return false;
};

exports.run = async (client, message, args, level) => {

    const rebootEmbed = client.createEmbed();

    await message.channel.send(rebootEmbed
    .setDescription("Bot is shutting down."));

    await Promise.all(client.commands.map(cmd =>
      client.unloadCommand(cmd)
    ));
    process.exit(0);

  };