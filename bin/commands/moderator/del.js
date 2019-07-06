"use strict";
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
        message.channel.bulkDelete(num, true).catch((error) => {
            console.error(error);
            delEmbed
                .setDescription("You can't delete messages older than 2 weeks!");
            message.channel.send(delEmbed);
        });
        delEmbed
            .setDescription(`Deleted ${args[0]} messages in this channel!`);
        message.channel.send(delEmbed)
            .then((msg) => msg.delete(5000))
            .catch((error) => console.log(error.message));
        return;
    }
    else {
        delEmbed
            .setDescription("You do not have the manage messages permission!");
        message.channel.send(delEmbed);
        return;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tbWFuZHMvbW9kZXJhdG9yL2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQVcsRUFBRSxPQUFZLEVBQUUsSUFBYyxFQUFFLEVBQUU7SUFFeEQsTUFBTSxRQUFRLEdBQVEsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzNDLE1BQU0sSUFBSSxHQUFRLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQzdELE1BQU0sR0FBRyxHQUFXLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFMUMsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNwQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ04sUUFBUTtpQkFDUCxjQUFjLENBQUMsa0NBQWtDLENBQUMsQ0FBQztZQUNwRCxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNsQztRQUVELElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxFQUFFO1lBQ3ZCLFFBQVE7aUJBQ1AsY0FBYyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7WUFDNUQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDbEM7UUFFRCxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBVSxFQUFFLEVBQUU7WUFDdkQsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNyQixRQUFRO2lCQUNQLGNBQWMsQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO1lBQ2pFLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQUEsQ0FBQyxDQUFDLENBQUM7UUFFckMsUUFBUTthQUNQLGNBQWMsQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDLENBQUMsNEJBQTRCLENBQUMsQ0FBQztRQUNoRSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7YUFDN0IsSUFBSSxDQUFDLENBQUMsR0FBUSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3BDLEtBQUssQ0FBQyxDQUFDLEtBQVUsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNuRCxPQUFPO0tBRVY7U0FBTTtRQUNILFFBQVE7YUFDUCxjQUFjLENBQUMsaURBQWlELENBQUMsQ0FBQztRQUNuRSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvQixPQUFPO0tBQ1Y7QUFDTCxDQUFDLENBQUEifQ==