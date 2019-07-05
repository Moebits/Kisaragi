exports.run = (client, message, score, args) => {

    const rankEmbed = client.createEmbed();
    if (score === (null || undefined)) {
    return message.channel.send(rankEmbed
        .setDescription("Could not find a score for you!"));
    }
    
    return message.channel.send(rankEmbed
        .setDescription(`You have **${score.points}** points and are level **${score.level}!**`));
}