exports.run = (discord: any, message: any, args: string[]) => {

    const giveEmbed: any = discord.createEmbed();

    if(!message.author.id === message.guild.owner) return message.send(giveEmbed
        .setDescription("Only the guild owner can use this command!"));

    const user: any = message.mentions.users.first() || discord.users.get(args[0]);
    if(!user) return message.channel.send(giveEmbed
        .setDescription("You must mention a user or provide their user ID!"));

    const pointsToAdd = parseInt(args[1]);
    if(!pointsToAdd) return message.channel.send(giveEmbed
        .setDescription("Correct usage is =>give (user) (points)"));

    let userscore: any = discord.getScore.get(user.id, message.guild.id);
    if (!userscore) {
        userscore = { id: `${message.guild.id}-${user.id}`, user: user.id, guild: message.guild.id, points: 0, level: 0}
    }
    userscore.points += pointsToAdd;

    let userLevel = Math.floor(discord.score.points / 1000);
    userscore.level = userLevel;

    discord.setScore.run(userscore);

    return message.channel.send(giveEmbed
        .setDescription(`${user.tag} has received ${pointsToAdd} points and now stands at ${userscore.points} points.`));
    
    
}