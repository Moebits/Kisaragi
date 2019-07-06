"use strict";
exports.run = (client, message, args) => {
    const remEmbed = client.createEmbed();
    const perm = client.createPermission("MANAGE_CHANNELS");
    if (message.member.hasPermission(perm)) {
    }
    else {
        remEmbed
            .setDescription("You do not have the manage channels permission!");
        message.channel.send(remEmbed);
        return;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVtZGFzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbW1hbmRzL3V0aWxpdHkvcmVtZGFzaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQVcsRUFBRSxPQUFZLEVBQUUsSUFBYyxFQUFFLEVBQUU7SUFFeEQsTUFBTSxRQUFRLEdBQVEsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzNDLE1BQU0sSUFBSSxHQUFRLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBRTdELElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUU7S0FHdkM7U0FBTTtRQUNILFFBQVE7YUFDUCxjQUFjLENBQUMsaURBQWlELENBQUMsQ0FBQztRQUNuRSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvQixPQUFPO0tBQ1Y7QUFFTCxDQUFDLENBQUEifQ==