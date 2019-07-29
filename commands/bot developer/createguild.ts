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
        client.cmdError();
    }
}

exports.run = (client: any, message: any, args: string[]) => {

    let ownerID: any = process.env.OWNER_ID;

    const evalEmbed: any = client.createEmbed();
    const guildName: string = args[1];
    const guildRegion: string = args[2];

    if (message.author.id === ownerID) {

        client.createGuild(client, message, guildName, guildRegion);

    } else {
        message.channel.send(evalEmbed
            .setDescription("In order to use this command, you must be a bot owner."))
            return;
    }
}