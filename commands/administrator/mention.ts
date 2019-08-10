exports.run = async (client: any, message: any, args: string[]) => {

    const mentionEmbed: any = client.createEmbed();
    const perm: any = client.createPermission("ADMINISTRATOR");

    if (message.member.hasPermission(perm)) {
        let input = client.combineArgs(args, 1);
        let role = message.guild.roles.find((r: any) => r.name.toLowerCase().includes(input.toLowerCase().trim()));
        if (!role) {message.channel.send(mentionEmbed
            .setDescription("Could not find that role!"))
            return;
        }
        await role.setMentionable(true);
        await message.channel.send(`<@&${role.id}>`);
        await role.setMentionable(false);

    } else {
        message.channel.send(mentionEmbed
            .setDescription("You must have administrator permissions in order to use this command!"))
            return;
    }
}