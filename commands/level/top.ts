exports.run = (client, message, args) => {
    
const top10 = client.scores.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 10;").all(message.guild.id);

  const topEmbed = client.createEmbed();
  topEmbed
    .setTitle(`**${message.guild.name}'s Leaderboard**`)
    .setAuthor(client.user.username, client.user.avatarURL);

  for(const data of top10) {
    topEmbed.addField(client.users.get(data.user).tag, `**${data.points}** points (level **${data.level}**)`);
  }
  return message.channel.send(topEmbed);  
}