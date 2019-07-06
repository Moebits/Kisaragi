"use strict";
exports.run = (client, message, args) => {
    const giveEmbed = client.createEmbed();
    if (!message.author.id === message.guild.owner)
        return message.send(giveEmbed
            .setDescription("Only the guild owner can use this command!"));
    const user = message.mentions.users.first() || client.users.get(args[0]);
    if (!user)
        return message.channel.send(giveEmbed
            .setDescription("You must mention a user or provide their user ID!"));
    const pointsToAdd = parseInt(args[1]);
    if (!pointsToAdd)
        return message.channel.send(giveEmbed
            .setDescription("Correct usage is =>give (user) (points)"));
    let userscore = client.getScore.get(user.id, message.guild.id);
    if (!userscore) {
        userscore = { id: `${message.guild.id}-${user.id}`, user: user.id, guild: message.guild.id, points: 0, level: 0 };
    }
    userscore.points += pointsToAdd;
    let userLevel = Math.floor(client.score.points / 1000);
    userscore.level = userLevel;
    client.setScore.run(userscore);
    return message.channel.send(giveEmbed
        .setDescription(`${user.tag} has received ${pointsToAdd} points and now stands at ${userscore.points} points.`));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbW1hbmRzL2xldmVsL2dpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFXLEVBQUUsT0FBWSxFQUFFLElBQWMsRUFBRSxFQUFFO0lBRXhELE1BQU0sU0FBUyxHQUFRLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUU1QyxJQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLO1FBQUUsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVM7YUFDdkUsY0FBYyxDQUFDLDRDQUE0QyxDQUFDLENBQUMsQ0FBQztJQUVuRSxNQUFNLElBQUksR0FBUSxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5RSxJQUFHLENBQUMsSUFBSTtRQUFFLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUzthQUMxQyxjQUFjLENBQUMsbURBQW1ELENBQUMsQ0FBQyxDQUFDO0lBRTFFLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0QyxJQUFHLENBQUMsV0FBVztRQUFFLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUzthQUNqRCxjQUFjLENBQUMseUNBQXlDLENBQUMsQ0FBQyxDQUFDO0lBRWhFLElBQUksU0FBUyxHQUFRLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNwRSxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ1osU0FBUyxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUMsQ0FBQTtLQUNuSDtJQUNELFNBQVMsQ0FBQyxNQUFNLElBQUksV0FBVyxDQUFDO0lBRWhDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDdkQsU0FBUyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7SUFFNUIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7SUFFL0IsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTO1NBQ2hDLGNBQWMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLGlCQUFpQixXQUFXLDZCQUE2QixTQUFTLENBQUMsTUFBTSxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBR3pILENBQUMsQ0FBQSJ9