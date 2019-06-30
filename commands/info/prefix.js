const config = require("../../config.json");

exports.run = (client, message, newPrefix) => {

    //Change Prefix
    function changePrefix (prefix) {
        this.prefix = prefix;
    }

    config.prefix = newPrefix;

    const prefixEmbed = client.createEmbed();
    prefixEmbed
    .setDescription("The prefix has been changed to " + newPrefix + "\n" + "If you ever forget the prefix just tag me!")
    message.channel.send(prefixEmbed)
    .catch(error => console.log("Caught", error.message));
    
}