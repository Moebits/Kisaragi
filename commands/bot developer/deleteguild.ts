exports.run = async (client: any, message: any, args: string[]) => {
    let ownerID: any = process.env.OWNER_ID;

    const deleteGuildEmbed: any = client.createEmbed();
    if (message.author.id === ownerID) {

        let guildID = args[1];
        let guild = client.guilds.find((g: any) => g.id.toString() === guildID);

        try {
            guild.delete();
        } catch (err) {
            console.log(err);
        } finally {
            await client.deleteGuild(guildID)
        }
        
    } else {
        message.channel.send(deleteGuildEmbed
            .setDescription("In order to use this command, you must be a bot owner."))
            return;
    }
}