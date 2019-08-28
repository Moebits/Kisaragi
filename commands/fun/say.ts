exports.run = async (discord: any, message: any, args: string[]) => {

    let prefix = await discord.fetchPrefix();

    let rawText = discord.combineArgs(args, 1);
    await message.channel.send(discord.checkChar(rawText, 2000, "."));
    if (message.content.startsWith(prefix[0])) await message.delete();
    return;
    
}