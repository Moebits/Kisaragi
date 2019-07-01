exports.run = (client, message, args) => {
    const delEmbed = client.createEmbed();
    const perm = client.createPermission("MANAGE_MESSAGES");
    const num = args[0];
    if (message.member.hasPermission(perm)) {
        if (!num) {
            delEmbed
                .setDescription("Correct usage is =>del (number).");
            message.channel.send(delEmbed);
            return;
        }
        message.channel.bulkDelete(num - 1);
        delEmbed
            .setDescription(`Deleted ${num} messages in this channel!`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tbWFuZHMvbW9kZXJhdG9yL2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRTtJQUVwQyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDdEMsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDeEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXBCLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDcEMsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNOLFFBQVE7aUJBQ1AsY0FBYyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7WUFDcEQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDL0IsT0FBTztTQUNWO1FBRUQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxHQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWxDLFFBQVE7YUFDUCxjQUFjLENBQUMsV0FBVyxHQUFHLDRCQUE0QixDQUFDLENBQUM7UUFDNUQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO2FBQzdCLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDN0IsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDdEQsT0FBTztLQUVWO1NBQU07UUFDSCxRQUFRO2FBQ1AsY0FBYyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7UUFDbkUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0IsT0FBTztLQUNWO0FBRUwsQ0FBQyxDQUFBIn0=