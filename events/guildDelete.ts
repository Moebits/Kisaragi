module.exports = (discord: any, message: any) => {
    discord.deleteGuild(message.guild);
}