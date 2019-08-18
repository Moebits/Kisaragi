exports.run = async (discord: any, message: any, args: string[]) => {
    let ownerID: any = process.env.OWNER_ID;

    const deleteGuildEmbed: any = discord.createEmbed();
    if (message.author.id === ownerID) {

        let guildID = args[1];
        let guild = discord.guilds.find((g: any) => g.id.toString() === guildID);

        try {
            guild.delete();
        } catch (err) {
            console.log(err);
        } finally {
            await discord.deleteGuild(guildID)
        }
        
    } else {
        message.channel.send(deleteGuildEmbed
            .setDescription("In order to use this command, you must be a bot owner."))
            return;
    }
}