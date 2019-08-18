exports.run = async (discord: any, message: any, args: string[]) => {

    const initEmbed: any = discord.createEmbed();
    const perm: any = discord.createPermission("ADMINISTRATOR");

    if (message.member.hasPermission(perm)) {
        await discord.deleteGuild(message.guild.id);
        await discord.initGuild();
        message.channel.send(initEmbed
            .setDescription("All guild settings have been reset to the default."))
            return;

    } else {
        message.channel.send(initEmbed
            .setDescription("You must have administrator permissions in order to use this command!"))
            return;
    }
}