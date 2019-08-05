exports.run = async (client: any, message: any, args: string[]) => {
    let flushEmbed = client.createEmbed();
    let ownerID: any = process.env.OWNER_ID;

    if (message.author.id === ownerID) {
        await client.flushDB();
        flushEmbed
        .setDescription("The database was flushed.")
        message.channel.send(flushEmbed);
    } else {
        message.channel.send(flushEmbed
            .setDescription("In order to use this command, you must be the bot developer."))
            return;
    }
    
}