exports.run = (client, message, args) => {

    const giveEmbed = client.createEmbed();

    if(!message.author.id === message.guild.owner) return message.send(giveEmbed
        .setDescription("Only the guild owner can use this command!"));

    const user = message.mentions.users.first() || client.users.get(args[0]);
    if(!user) return message.channel.send(giveEmbed
        .setDescription("You must mention a user or provide their user ID!"));

    const pointsToAdd = parseInt(args[1]);
    if(!pointsToAdd) return message.channel.send(giveEmbed
        .setDescription("Correct usage is =>give (user) (points)"));

    let userscore = client.getScore.get(user.id, message.guild.id);
    if (!userscore) {
        userscore = { id: `${message.guild.id}-${user.id}`, user: user.id, guild: message.guild.id, points: 0, level: 0}
    }
    userscore.points += pointsToAdd;

    let userLevel = Math.floor(0.01 * client.score.points);
    userscore.level = userLevel;

    client.setScore.run(userscore);

    return message.channel.send(giveEmbed
        .setDescription(`${user.tag} has received ${pointsToAdd} points and now stands at ${userscore.points} points.`));
    
    
}