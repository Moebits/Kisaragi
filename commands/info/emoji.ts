exports.run = async (client: any, message: any, args: string[]) => {

    const emojiEmbed: any = client.createEmbed();

    if (args[1] === "list") {
        const emojiList = message.guild.emojis.map((e: any)=>e.toString()).join(" ");
            emojiEmbed
            .setTitle("**Only shows the first 2000 characters.**")
            .setDescription(client.checkChar(emojiList, 2000, "<"));
            message.channel.send(emojiEmbed);
        return;
    } 

    const emojiName: string = args[1];
    
    if (!emojiName.includes("<" || ">")) {

        const emojiFound = client.emojis.find((emoji: any) => emoji.identifier === emojiName);
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

    let snowflake: RegExp = /\d+/;
    let emojiID: string = emojiName.substring(emojiName.search(snowflake));
    if (emojiID.includes(">")) {emojiID = emojiID.slice(0, -1);}

    if (typeof parseInt(emojiID) === "number") {
        let emojiGet: any = client.emojis.get(emojiID);
        message.channel.send(emojiEmbed
            .setDescription(`**${emojiGet.name} Emoji**`)
            .setImage(emojiGet.url))
            return;
    } 
}


