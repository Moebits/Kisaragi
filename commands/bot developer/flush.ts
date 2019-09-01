exports.run = async (discord: any, message: any, args: string[]) => {
    if (discord.checkBotDev(message)) return;
    let flushEmbed = discord.createEmbed();

    await discord.flushDB();
    flushEmbed
    .setDescription("The database was **flushed**!")
    message.channel.send(flushEmbed);
    
}