exports.run = (client: any, message: any, args: string[]) => {

    let newPrefix = args[1];

    let prefix = client.fetchPrefix();

    client.updateColumn(prefix, newPrefix);

    const prefixEmbed: any = client.createEmbed();
    prefixEmbed
    .setDescription("The prefix has been changed to " + newPrefix + "\n" + "If you ever forget the prefix just tag me!")
    message.channel.send(prefixEmbed)
    
}