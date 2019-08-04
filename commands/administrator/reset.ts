exports.run = async (client: any, message: any, args: string[]) => {

    const initEmbed: any = client.createEmbed();
    const perm: any = client.createPermission("ADMINISTRATOR");

    if (message.member.hasPermission(perm)) {
        await client.deleteGuild(message.guild.id);
        await client.initGuild();
        message.channel.send(initEmbed
            .setDescription("All guild settings have been reset to the default."))
            return;

    } else {
        message.channel.send(initEmbed
            .setDescription("You must have administrator permissions in order to use this command!"))
            return;
    }
}