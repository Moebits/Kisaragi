exports.run = async (discord: any, message: any, args: string[]) => {
    if (discord.checkBotDev(message)) return;
    let orderEmbed = discord.createEmbed();

    await discord.orderTables();
    orderEmbed
    .setDescription("The tables were **ordered**!")
    message.channel.send(orderEmbed);
    
}