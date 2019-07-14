module.exports = (client: any, message: any) => {
    client.deleteGuild(message.guild);
}