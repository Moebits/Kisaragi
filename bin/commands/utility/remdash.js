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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVtZGFzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbW1hbmRzL3V0aWxpdHkvcmVtZGFzaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRTtJQUVwQyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDdEMsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFFeEQsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRTtLQUd2QztTQUFNO1FBQ0gsUUFBUTthQUNQLGNBQWMsQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO1FBQ25FLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9CLE9BQU87S0FDVjtBQUVMLENBQUMsQ0FBQSJ9