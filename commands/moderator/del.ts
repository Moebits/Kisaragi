exports.run = (client: any, message: any, args: string[]) => {

    const delEmbed: any = client.createEmbed();
    const perm: any = client.createPermission("MANAGE_MESSAGES");
    const num: number = parseInt(args[0]) + 1;

    if (message.member.hasPermission(perm)) {
        if (!num) {
            delEmbed
            .setDescription("Correct usage is =>del (number).");
            message.channel.send(delEmbed);
        }

        if (num <= 1 || num > 100) {
            delEmbed
            .setDescription("You must type a number between 1 and 99!");
            message.channel.send(delEmbed);
        }
        
        message.channel.bulkDelete(num, true).catch(error => {
            console.error(error);
            delEmbed
            .setDescription("You can't delete messages older than 2 weeks!");
            message.channel.send(delEmbed)});

        delEmbed
        .setDescription(`Deleted ${args[0]} messages in this channel!`);
        message.channel.send(delEmbed)
        .then((msg: any) => msg.delete(5000))
        .catch((error: any) => console.log(error.message));
        return;

    } else {
        delEmbed
        .setDescription("You do not have the manage messages permission!");
        message.channel.send(delEmbed);
        return;
    }
}
