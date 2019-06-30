exports.run = (client, message, args) => {

    const remEmbed = client.createEmbed();
    const perm = client.createPermission("MANAGE_CHANNELS");

    if (message.member.hasPermission(perm)) {
        

    } else {
        remEmbed
        .setDescription("You do not have the manage channels permission!");
        message.channel.send(delEmbed);
        return;
    }
    
}