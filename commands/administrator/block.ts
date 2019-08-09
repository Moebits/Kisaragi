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
    `${client.getEmoji("star")}**Type any word** to add a blocked word.\n` +
    `${client.getEmoji("star")}Type **enable** or **disable** to enable/disable filtering.\n` +
    `${client.getEmoji("star")}Type **exact** or **partial** to set the matching algorithm.\n` +
    `${client.getEmoji("star")}Type **delete (word number)** to delete a word.\n` +
    `${client.getEmoji("star")}Type **reset** to delete all words.\n` +
    `${client.getEmoji("star")}Type **cancel** to exit.\n`
    )
    message.channel.send(blockEmbed);

    async function blockPrompt(msg: any) {

    }

    client.createPrompt(blockPrompt);
}