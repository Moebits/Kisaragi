exports.run = async (discord: any, message: any, args: string[]) => {

    let newPrefix = args[1];

    await discord.updateColumn("prefixes", "prefix", newPrefix);

    const prefixEmbed: any = discord.createEmbed();
    prefixEmbed
    .setDescription("The prefix has been changed to " + newPrefix + "\n" + "If you ever forget the prefix just tag me!")
    message.channel.send(prefixEmbed);
    return;
    
}