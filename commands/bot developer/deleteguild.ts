exports.run = async (discord: any, message: any, args: string[]) => {
    if (discord.checkBotDev(message)) return;


    let guildID = args[1];
    let guild = discord.guilds.find((g: any) => g.id.toString() === guildID);

    try {
        guild.delete();
    } catch (err) {
        console.log(err);
    } finally {
        await discord.deleteGuild(guildID)
    }
}