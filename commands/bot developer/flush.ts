exports.run = async (discord: any, message: any, args: string[]) => {
    let flushEmbed = discord.createEmbed();
    let ownerID: any = process.env.OWNER_ID;

    if (message.author.id === ownerID) {
        await discord.flushDB();
        flushEmbed
        .setDescription("The database was flushed.")
        message.channel.send(flushEmbed);
    } else {
        message.channel.send(flushEmbed
            .setDescription("In order to use this command, you must be the bot developer."))
            return;
    }
    
}