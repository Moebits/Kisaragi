exports.run = async (client, message, args, level) => {

    const rebootEmbed = client.createEmbed();

    await message.channel.send(rebootEmbed
    .setDescription("Bot is shutting down."));

    await Promise.all(client.commands.map(cmd =>
      client.unloadCommand(cmd)
    ));
    process.exit(0);

  };