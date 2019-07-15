exports.run = async (client: any, message: any, args: string[]) => {

    const kickEmbed: any = client.createEmbed();
    const perm: any = client.createPermission("KICK_MEMBERS");
    let reason = client.combineArgs(args, 2);

    if (message.member.hasPermission(perm)) {
        let user = message.mentions.users.first();
        let member = message.guild.member(user);
        if (!reason) {
            reason = "None provided!";
        }
        if (!user) {
            user = client.fetchUser(args[1]);
        }
        try {
            await member.kick(reason);
            kickEmbed
            .setTitle(`**Member Kicked** ${client.getEmoji("kannaFU")}`)
            .setDescription(`Successfully kicked ${user} for reason: **${reason}**`);
            message.channel.send(kickEmbed);
        } catch (error) {
            client.cmdError(error);
            kickEmbed
            .setDescription("Could not find that user!");
            message.channel.send(kickEmbed);
        }
    } else {
        kickEmbed
        .setDescription("You do not have the kick members permission!");
        message.channel.send(kickEmbed);
        return;
    }
}