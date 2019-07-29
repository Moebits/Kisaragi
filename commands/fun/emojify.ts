exports.run = async (client: any, message: any, args: string[]) => {

    let text = client.combineArgs(args, 1);
    let emojiFied = client.letters(text);
    message.channel.send(`>${emojiFied}`);

}