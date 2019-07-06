const createGuild = async (client: any, message: any, guildName: string, guildRegion: string) => {

    try {
        const guild: any = await client.user.createGuild(guildName, guildRegion);
        const defaultChannel: any = guild.channels.find((channel: any) => channel.permissionsFor(guild.me).has("SEND_MESSAGES"));
        const invite: any = await defaultChannel.createInvite();
        await message.author.send(invite.url);
        await message.channel.send(`I made a guild! The invite it ${invite.url}`);
        const role: any = await guild.createRole({name: "Administrator", permissions: ["ADMINISTRATOR"]});
        await message.author.send(role.id);

    } catch (error) {
    console.error(error);
    }
}

exports.run = (client: any, message: any, args: string[]) => {

    const evalEmbed: any = client.createEmbed();
    const guildName: string = args[0];
    const guildRegion: string = args[1];

    if (client.checkBotOwner()) {

        client.createGuild(client, message, guildName, guildRegion);

    } else {
        message.channel.send(evalEmbed
            .setDescription("In order to use this command, you must be a bot owner."))
            return;
    }
}