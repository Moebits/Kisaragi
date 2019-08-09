exports.run = async (client: any, message: any, args: string[]) => {
    let input = client.combineArgs(args, 1);
    if (input.trim()) {
        message.content = input.trim();
        linkPrompt(message);
        return;
    }
    let text = await client.fetchColumn("links", "text");
    let voice = await client.fetchColumn("links", "voice");
    let toggle = await client.fetchColumn("links", "toggle");

    let description = "";
    if (text[0]) {
        for (let i = 0; i < text[0].length; i++) {
            description += `**=> ${i}\n**` + `${client.getEmoji("star")}_Text:_ <#${text[0][i]}>\n` +
            `${client.getEmoji("star")}_Voice:_ ${voice[0][i]}\n` +
            `${client.getEmoji("star")}_State:_ ${toggle[0][i]}\n`
        }
    }
    let linkEmbed = client.createEmbed();
    linkEmbed
    .setTitle(`**Linked Channels** ${client.getEmoji("gabSip")}`)
    .setThumbnail(message.guild.iconURL)
    .setDescription(
        "Configure settings for linked channels. You can link a text channel to a voice channel so that only people on the voice channel can access it.\n" +
        "\n" +
        "__Current Settings:__\n" +
        description +
        "\n" +
        "__Edit Settings:__\n" +
        `${client.getEmoji("star")}_**Mention a text channel** to set the text channel.\n` +
        `${client.getEmoji("star")}_**Type the name of the voice channel** to set the voice channel.\n` +
        `${client.getEmoji("star")}_Type **toggle (setting number)** to toggle on/off.\n` +
        `${client.getEmoji("star")}_Type **edit (setting number)** to edit a setting.\n` +
        `${client.getEmoji("star")}_Type **delete (setting number)** to delete a setting.\n` +
        `${client.getEmoji("star")}_Type **reset** to delete all settings.\n` +
        `${client.getEmoji("star")}_Type **cancel** to exit.\n` 
    )
    //message.channel.send(linkEmbed)

    async function linkPrompt(msg: any) {

    }

    client.createPrompt(linkPrompt);
}