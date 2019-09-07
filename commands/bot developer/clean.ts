exports.run = async (discord: any, message: any, args: string[]) => {
    if (discord.checkBotDev(message)) return;
    let cleanEmbed = discord.createEmbed();

    await discord.purgeTable("ignore");
    await discord.purgeTable("collectors");
    await discord.flushDB();
    cleanEmbed
    .setDescription("Tables were **cleaned**! Cached data was deleted.")
    message.channel.send(cleanEmbed);
}