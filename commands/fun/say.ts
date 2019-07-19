exports.run = async (client: any, message: any, args: string[]) => {

    if (args[1] === "raw" || args[1] === "r") {
        let rawText = client.combineArgs(args, 2);
        message.channel.send(client.checkChar(rawText, 2000, "."));
        return;
    }

    else {
        let text = client.combineArgs(args, 1);
        console.log(text)
        let emojiFied = client.letters(text);
        message.channel.send(`>${emojiFied}`);
    }
    
}