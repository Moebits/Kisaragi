exports.run = (client, message, newPrefix) => {

    newPrefix = config.prefix;

    const prefixEmbed = client.createEmbed();
    prefixEmbed
    .setDescription("The prefix has been changed to " + newPrefix + "\n" + "If you ever forget the prefix just tag me!")
    message.channel.send(prefixEmbed)
    .catch(error => console.log("Caught", error.message));
    
}