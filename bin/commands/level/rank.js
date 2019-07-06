"use strict";
exports.run = (client, message, score, args) => {
    const rankEmbed = client.createEmbed();
    if (score === (null || undefined)) {
        return message.channel.send(rankEmbed
            .setDescription("Could not find a score for you!"));
    }
    return message.channel.send(rankEmbed
        .setDescription(`You have **${score.points}** points and are level **${score.level}!**`));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbW1hbmRzL2xldmVsL3JhbmsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFXLEVBQUUsT0FBWSxFQUFFLEtBQVUsRUFBRSxJQUFjLEVBQUUsRUFBRTtJQUVwRSxNQUFNLFNBQVMsR0FBUSxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDNUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJLElBQUksU0FBUyxDQUFDLEVBQUU7UUFDbkMsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTO2FBQ2hDLGNBQWMsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLENBQUM7S0FDdkQ7SUFFRCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVM7U0FDaEMsY0FBYyxDQUFDLGNBQWMsS0FBSyxDQUFDLE1BQU0sNkJBQTZCLEtBQUssQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDbEcsQ0FBQyxDQUFBIn0=