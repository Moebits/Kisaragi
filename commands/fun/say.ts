exports.run = async (discord: any, message: any, args: string[]) => {

    let rawText = discord.combineArgs(args, 1);
    await message.channel.send(discord.checkChar(rawText, 2000, "."));
    await message.delete(1000);
    return;
    
}