exports.run = (client, message, args) => {
    var activityType = args[0];
    var activityName = client.combineArgs(args, 1);
    const activityTypes = ["playing", "watching", "listening", "streaming"];
    const setEmbed = client.createEmbed();
    if (client.checkBotOwner()) {
        if (!activityName || (!activityTypes.includes(activityType))) {
            message.channel.send(setEmbed
                .setDescription("Correct usage is =>set (type) (activity), where (type) is playing, watching, listening, or streaming."));
        }
        if (activityType === "streaming") {
            client.user.setActivity(activityName, { url: "https://www.twitch.tv/tenpimusic" }, { type: activityType });
            message.channel.send(setEmbed
                .setDescription(`I am now ${activityType} ${activityName}`));
            return;
        }
        client.user.setActivity(activityName, { type: activityType });
        message.channel.send(setEmbed
            .setDescription(`I am now ${activityType} ${activityName}`));
    }
    else {
        message.channel.send(setEmbed
            .setDescription("In order to use this command, you must be a bot owner."));
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tbWFuZHMvYm90IG93bmVyL3NldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRTtJQUVwQyxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0IsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFL0MsTUFBTSxhQUFhLEdBQUcsQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN4RSxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7SUFFdEMsSUFBSSxNQUFNLENBQUMsYUFBYSxFQUFFLEVBQUU7UUFFeEIsSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFO1lBQzFELE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVE7aUJBQzVCLGNBQWMsQ0FBQyx1R0FBdUcsQ0FBQyxDQUFDLENBQUM7U0FFN0g7UUFFRCxJQUFJLFlBQVksS0FBSyxXQUFXLEVBQUU7WUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLEVBQUMsR0FBRyxFQUFFLGtDQUFrQyxFQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsWUFBWSxFQUFDLENBQUMsQ0FBQztZQUN2RyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRO2lCQUM1QixjQUFjLENBQUMsWUFBWSxZQUFZLElBQUksWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzdELE9BQU87U0FDVjtRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxFQUFDLElBQUksRUFBRSxZQUFZLEVBQUMsQ0FBQyxDQUFDO1FBQzVELE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVE7YUFDNUIsY0FBYyxDQUFDLFlBQVksWUFBWSxJQUFJLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQztLQUVoRTtTQUFNO1FBQ0gsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUTthQUN4QixjQUFjLENBQUMsd0RBQXdELENBQUMsQ0FBQyxDQUFDO0tBQ2xGO0FBRUwsQ0FBQyxDQUFBIn0=