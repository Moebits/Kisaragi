exports.run = async (discord: any, message: any, args: string[]) => {

    let text = discord.combineArgs(args, 1);
    let emojiFied = discord.letters(text);
    message.channel.send(`>${emojiFied}`);

}