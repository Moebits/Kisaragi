exports.run = async (discord: any, message: any, args: string[]) => {

    const mentionEmbed: any = discord.createEmbed();
    const perm: any = discord.createPermission("ADMINISTRATOR");
    let prefix = await discord.fetchPrefix();

    if (message.member.hasPermission(perm)) {
        let input = discord.combineArgs(args, 1);
        let role = message.guild.roles.find((r: any) => r.name.toLowerCase().includes(input.toLowerCase().trim()));
        if (!role) {message.channel.send(mentionEmbed
            .setDescription("Could not find that role!"))
            return;
        }
        await role.setMentionable(true);
        await message.channel.send(`<@&${role.id}>`);
        await role.setMentionable(false);
        if (message.content.startsWith(prefix[0])) await message.delete();

    } else {
        message.channel.send(mentionEmbed
            .setDescription("You must have administrator permissions in order to use this command!"))
            return;
    }
}