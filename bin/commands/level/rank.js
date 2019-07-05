exports.run = (client, message, score, args) => {
    const rankEmbed = client.createEmbed();
    if (score === (null || undefined)) {
        return message.channel.send(rankEmbed
            .setDescription("Could not find a score for you!"));
    }
    return message.channel.send(rankEmbed
        .setDescription(`You have **${score.points}** points and are level **${score.level}!**`));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbW1hbmRzL2xldmVsL3JhbmsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO0lBRTNDLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN2QyxJQUFJLEtBQUssS0FBSyxDQUFDLElBQUksSUFBSSxTQUFTLENBQUMsRUFBRTtRQUNuQyxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVM7YUFDaEMsY0FBYyxDQUFDLGlDQUFpQyxDQUFDLENBQUMsQ0FBQztLQUN2RDtJQUVELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUztTQUNoQyxjQUFjLENBQUMsY0FBYyxLQUFLLENBQUMsTUFBTSw2QkFBNkIsS0FBSyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNsRyxDQUFDLENBQUEifQ==