exports.run = async (client, message, args) => {

    const emojiEmbed = client.createEmbed();

    if (args[0] === "list") {
        const emojiList = message.guild.emojis.map(e=>e.toString()).join(" ");
        message.channel.send(emojiEmbed
            .setTitle("**Only shows the first 2000 characters.**")
            .setDescription(emojiList.slice(0,2000)));
        return;
    } 

    const emojiName = args[0];
    
    if (!emojiName.includes("<" || ">")) {

        const emojiFound = client.emojis.find(emoji => emoji.name === emojiName);
        if (emojiFound === null) {
            message.channel.send(emojiEmbed
                .setDescription("Could not find that emoji!"));
            return;
        }
        message.channel.send(emojiEmbed
            .setDescription(`**${emojiName} Emoji**`)
            .setImage(`${emojiFound.url}`));
            return;

        }

    let snowflake = /\d+/;
    let emojiID = emojiName.substring(emojiName.search(snowflake));
    if (emojiID.includes(">")) {emojiID = emojiID.slice(0, -1);}

    if (typeof parseInt(emojiID) === "number") {
        let emojiGet = client.emojis.get(emojiID);
        message.channel.send(emojiEmbed
            .setDescription(`**${emojiGet.name} Emoji**`)
            .setImage(emojiGet.url))
            return;
    } 

    
}


