exports.run = async (client: any, message: any, args: string[]) => {

    const guildIconEmbed: any = client.createEmbed();
    if (message.guild.available) {

        await message.channel.send(guildIconEmbed
            .setDescription(`**${message.guild.name}'s Guild Icon**`)
            .setImage(`${message.guild.iconURL}` + "?size=2048"));

    } else {
        message.channel.send(guildIconEmbed
            .setDescription(`Could not retrieve this guild's icon.`));
    }
}
	