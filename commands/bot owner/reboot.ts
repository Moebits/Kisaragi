const unloadCommand: any = async (commandName: string) => {
  let command: any;
  if (client.commands.has(commandName)) {
    command = client.commands.get(commandName);
  } else if (client.aliases.has(commandName)) {
    command = client.commands.get(client.aliases.get(commandName));
  }
  if (!command) return `The command \`${commandName}\` could not be found.`;

  if (command.shutdown) {
    await command.shutdown(client);
  }

  const mod: any = require.cache[require.resolve(`../commands/$${commandName}`)];
  delete require.cache[require.resolve(`../commands/${commandName}.js`)];
  for (let i = 0; i < mod.parent.children.length; i++) {
    if (mod.parent.children[i] === mod) {
      mod.parent.children.splice(i, 1);
      break;
    }
  }
  return false;
};

exports.run = async (client: any, message: any, args: string[]) => {

    const rebootEmbed: any = client.createEmbed();

    await message.channel.send(rebootEmbed
    .setDescription("Bot is shutting down."));

    await Promise.all(client.commands.map((cmd: any) =>
      client.unloadCommand(cmd)
    ));
    process.exit(0);
  };