exports.run = (client, message, args) => {

    const delEmbed = client.createEmbed();
    const perm = client.createPermission("MANAGE_MESSAGES");
    const num = args[0];

    if (message.member.hasPermission(perm)) {
        if (!num) {
            delEmbed
            .setDescription("Correct usage is =>del (number).");
            message.channel.send(delEmbed);
            return;
        }
        
        message.channel.bulkDelete(num-1);

        delEmbed
        .setDescription(`Deleted ${num} messages in this channel!`);
        message.channel.send(delEmbed)
        .then(msg => msg.delete(5000))
        .catch(error => console.log("Caught", error.message));
        return;

    } else {
        delEmbed
        .setDescription("You do not have the manage messages permission!");
        message.channel.send(delEmbed);
        return;
    }
    
}
