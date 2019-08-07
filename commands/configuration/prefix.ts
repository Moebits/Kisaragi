exports.run = async (client: any, message: any, args: string[]) => {

    let newPrefix = args[1];

    await client.updateColumn("prefixes", "prefix", newPrefix);

    const prefixEmbed: any = client.createEmbed();
    prefixEmbed
    .setDescription("The prefix has been changed to " + newPrefix + "\n" + "If you ever forget the prefix just tag me!")
    message.channel.send(prefixEmbed);
    return;
    
}