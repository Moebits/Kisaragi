exports.run = async (discord: any, message: any, args: string[]) => {
  if (discord.checkBotDev(message)) return;

  const rebootEmbed: any = discord.createEmbed();

  const unloadCommand: any = async (commandName: string) => {
    let command: any;
    if (discord.commands.has(commandName)) {
      command = discord.commands.get(commandName);
    } else if (discord.aliases.has(commandName)) {
      command = discord.commands.get(discord.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` could not be found.`;
  
    if (command.shutdown) {
      await command.shutdown(discord);
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

      await message.channel.send(rebootEmbed
      .setDescription("Bot is shutting down."));

      await Promise.all(discord.commands.map((cmd: any) =>
        unloadCommand(cmd)
      ));
      process.exit(0);
  };