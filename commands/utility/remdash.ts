exports.run = (client: any, message: any, args: string[]) => {

    const remEmbed: any = client.createEmbed();
    const perm: any = client.createPermission("MANAGE_CHANNELS");

    if (message.member.hasPermission(perm)) {
        

    } else {
        remEmbed
        .setDescription("You do not have the manage channels permission!");
        message.channel.send(remEmbed);
        return;
    }
    
}