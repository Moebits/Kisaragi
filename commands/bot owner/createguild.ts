async function createGuild(client, message) {
    try {
        const guild = await client.user.createGuild('Example Guild', 'london');
        const defaultChannel = guild.channels.find(channel => channel.permissionsFor(guild.me).has("SEND_MESSAGES"));
        const invite = await defaultChannel.createInvite();
        await message.author.send(invite.url);
        await message.channel.send(`I made a guild! The invite it ${invite.url}`);
        const role = await guild.createRole({ name:'Example Role', permissions:['ADMINISTRATOR'] });
        await message.author.send(role.id);
    } catch (e) {
    console.error(e);
    }
}

exports.run = (client, message, args) => {

    const evalEmbed = client.createEmbed();

    if (client.checkBotOwner()) {
        
        client.user.createGuild('Example Guild', 'london').then(guild => {
            guild.channels.get(guild.id).createInvite()
                .then(invite => client.users.get(ownerID).send(invite.url));
            guild.createRole({name:'Example Role', permissions:['ADMINISTRATOR']})
                .then(role => client.users.get(ownerID).send(role.id))
                .catch(error => console.log(error))
        });

        createGuild(client, message);

    } else {
        message.channel.send(evalEmbed
            .setDescription("In order to use this command, you must be a bot owner."))
            .catch(error => console.log("Caught", error.message))
            return;
    }
}