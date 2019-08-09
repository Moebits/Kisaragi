exports.run = async (client: any, message: any, args: string[]) => {
    let input = client.combineArgs(args, 1);
    if (input.trim()) {
        message.content = input.trim();
        blockPrompt(message);
        return;
    }
    let words = await client.fetchColumn("blocks", "blocked words");
    let wordList = "";
    if (words[0]) {
        for (let i = 0; i < words[0].length; i++) {
            wordList += `**${i} - ${words[0][i]}**\n`
        }
    } else {
        wordList = "None"
    }
    let blockEmbed = client.createEmbed();
    blockEmbed
    .setTitle(`**Blocked Words** ${client.getEmoji("gabuChrist")}`)
    .setThumbnail(message.guild.iconURL)
    .setDescription(
    "Add or remove blocked words.\n" +
    "\n" +
    "__Word List__\n" +
    wordList + "\n" +
    "\n" +
    "__Edit Settings__" +
    "\n" +
    `${client.getEmoji("star")}_**Type any words**, separated by a space, to add blocked words._\n` +
    `${client.getEmoji("star")}_Type **enable** or **disable** to enable/disable filtering._\n` +
    `${client.getEmoji("star")}_Type **exact** or **partial** to set the matching algorithm._\n` +
    `${client.getEmoji("star")}_Type **delete (word number)** to delete a word._\n` +
    `${client.getEmoji("star")}_Type **reset** to delete all words._\n` +
    `${client.getEmoji("star")}_Type **cancel** to exit._\n`
    )
    //message.channel.send(blockEmbed);

    async function blockPrompt(msg: any) {
        let responseEmbed = client.createEmbed();
        let setOn, setOff, setExact, setPartial//, setWord;
        if (msg.content.toLowerCase() === "cancel") {
            responseEmbed
            .setDescription(`${client.getEmoji("star")}Canceled the prompt!`)
            msg.channel.send(responseEmbed);
            return;
        } 
        if (msg.content.toLowerCase() === "reset") {
            await client.updateColumn("blocks", "blocked words", null);
            responseEmbed
            .setDescription(`${client.getEmoji("star")}All blocked words were deleted!`)
            msg.channel.send(responseEmbed);
            return;
        }
        
        let newMsg = msg.content.replace(/enable/g, "").replace(/disable/g, "").replace(/exact/g, "").replace(/partial/g, "").replace(/\s+/g, "");
        if (msg.content.match(/enable/g)) setOn = true;
        if (msg.content.match(/disable/g)) setOff = true;
        if (msg.content.match(/exact/g)) setExact = true;
        if (msg.content.match(/partial/g)) setPartial = true;
        //if (newMsg) setWord = true;

        let wordArray = newMsg.split(",");
        console.log(wordArray)

        if (setOn && setOff) {
            responseEmbed
                .setDescription(`${client.getEmoji("star")}You cannot disable/enable at the same time.`)
                msg.channel.send(responseEmbed);
                return;
        }

        if (setExact && setPartial) {
            responseEmbed
                .setDescription(`${client.getEmoji("star")}You can only choose one matching algorithm.`)
                msg.channel.send(responseEmbed);
                return;
        }

        /*if (setWord) {
            await client.updateColumn("blocks", "blocked words", wordArray);
        }*/

    }

    client.createPrompt(blockPrompt);
}