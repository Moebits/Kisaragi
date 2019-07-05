exports.run = (client: any, message: any, args: string[]) => {

    const helpEmbedInfo: any = client.createEmbed();
        helpEmbedInfo
        .setImage("https://i.imgur.com/Av9RN7x.png")
        .setThumbnail(message.author.avatarURL)
        .setFooter("Page 1 • Info Commands", message.guild.iconURL)
        .setTitle(`Info Commands ${client.getEmoji("gabTired")}`)
        .setDescription("Click on the reactions to scroll to other pages!")
        .addField("=>help", "Shows all of the bot commands.")
        .addField("=>prefix (prefix)", "Changes the prefix of the bot.")
        .addField("=>set (activity) (type)", "Sets the bot's activity. Required -> Bot Owner");

    message.channel.send(helpEmbedInfo)
    
}