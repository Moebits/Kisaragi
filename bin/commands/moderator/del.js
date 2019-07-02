exports.run = (client, message, args) => {
    const delEmbed = client.createEmbed();
    const perm = client.createPermission("MANAGE_MESSAGES");
    const num = parseInt(args[0]) + 1;
    if (message.member.hasPermission(perm)) {
        if (!num) {
            delEmbed
                .setDescription("Correct usage is =>del (number).");
            message.channel.send(delEmbed);
        }
        if (num <= 1 || num > 100) {
            delEmbed
                .setDescription("You must type a number between 1 and 99!");
            message.channel.send(delEmbed);
        }
        message.channel.bulkDelete(num, true).catch(error => {
            console.error(error);
            delEmbed
                .setDescription("You can't delete messages older than 2 weeks!");
            message.channel.send(delEmbed);
        });
        delEmbed
            .setDescription(`Deleted ${args[0]} messages in this channel!`);
        message.channel.send(delEmbed)
            .then(msg => msg.delete(5000))
            .catch(error => console.log("Caught", error.message));
        return;
    }
    else {
        delEmbed
            .setDescription("You do not have the manage messages permission!");
        message.channel.send(delEmbed);
        return;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tbWFuZHMvbW9kZXJhdG9yL2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRTtJQUVwQyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDdEMsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDeEQsTUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUVsQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ3BDLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDTixRQUFRO2lCQUNQLGNBQWMsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO1lBQ3BELE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ2xDO1FBRUQsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLEVBQUU7WUFDdkIsUUFBUTtpQkFDUCxjQUFjLENBQUMsMENBQTBDLENBQUMsQ0FBQztZQUM1RCxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNsQztRQUVELE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDaEQsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNyQixRQUFRO2lCQUNQLGNBQWMsQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO1lBQ2pFLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQUEsQ0FBQyxDQUFDLENBQUM7UUFFckMsUUFBUTthQUNQLGNBQWMsQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDLENBQUMsNEJBQTRCLENBQUMsQ0FBQztRQUNoRSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7YUFDN0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM3QixLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUN0RCxPQUFPO0tBRVY7U0FBTTtRQUNILFFBQVE7YUFDUCxjQUFjLENBQUMsaURBQWlELENBQUMsQ0FBQztRQUNuRSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvQixPQUFPO0tBQ1Y7QUFFTCxDQUFDLENBQUEifQ==