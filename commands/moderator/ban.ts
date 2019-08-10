exports.run = async (client: any, message: any, args: string[]) => {

    const banEmbed: any = client.createEmbed();
    const perm: any = client.createPermission("BAN_MEMBERS");
    let reason = client.combineArgs(args, 2);

    if (message.member.hasPermission(perm)) {
        let user = message.mentions.users.first();
        if (!reason) {
            reason = "None provided!";
        }
        if (!user) {
            user = await client.fetchUser(args[1]);
        }
        try {
            await message.guild.ban(user, reason);
            banEmbed
            .setAuthor("ban", "https://discordemoji.com/assets/emoji/bancat.png")
            .setTitle(`**Member Banned** ${client.getEmoji("kannaFU")}`)
            .setDescription(`${client.getEmoji("star")}_Successfully banned ${user} for reason:_ **${reason}**`);
            message.channel.send(banEmbed);
            banEmbed
            .setTitle(`**You Were Banned** ${client.getEmoji("kannaFU")}`)
            .setDescription(`${client.getEmoji("star")}_You were banned from ${message.guild.name} for reason:_ **${reason}**`);
            await user.send(banEmbed);
        } catch (error) {
            client.cmdError(error);
            banEmbed
            .setDescription("Could not find that user!");
            message.channel.send(banEmbed);
        }
    } else {
        banEmbed
        .setDescription("You do not have the ban members permission!");
        message.channel.send(banEmbed);
        return;
    }
}