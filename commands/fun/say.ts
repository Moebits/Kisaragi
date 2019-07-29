exports.run = async (client: any, message: any, args: string[]) => {

    let rawText = client.combineArgs(args, 1);
    message.channel.send(client.checkChar(rawText, 2000, "."));
    return;
    
}