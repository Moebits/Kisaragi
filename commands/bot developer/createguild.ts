const createGuild = async (discord: any, message: any, guildName: string, guildRegion: string) => {
    if (discord.checkBotDev(message)) return;

    try {
        const guild: any = await discord.user.createGuild(guildName, guildRegion);
        const defaultChannel: any = guild.channels.find((channel: any) => channel.permissionsFor(guild.me).has("SEND_MESSAGES"));
        const invite: any = await defaultChannel.createInvite();
        await message.author.send(invite.url);
        const role: any = await guild.createRole({name: "Administrator", permissions: ["ADMINISTRATOR"]});
        await message.author.send(role.id);
        await message.channel.send(`I made a guild! The invite is ${invite.url} The Administrator role ID is ${role.id}.`);

    } catch (error) {
        discord.cmdError();
    }
}

exports.run = async (discord: any, message: any, args: string[]) => {

    const guildName: string = args[1];
    const guildRegion: string = args[2];


    await createGuild(discord, message, guildName, guildRegion);
}