exports.run = async (discord: any, message: any, args: string[]) => {
    if (await discord.checkAdmin(message)) return;
    const mentionEmbed: any = discord.createEmbed();
    let prefix = await discord.fetchPrefix();

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
}