exports.run = async (discord: any, message: any, args: string[]) => {
    if (await discord.checkAdmin(message)) return;

    const initEmbed: any = discord.createEmbed();

    
    await discord.deleteGuild(message.guild.id);
    await discord.initGuild();
    message.channel.send(
    initEmbed
    .setDescription("All guild settings have been reset to the default."));
    return;
}