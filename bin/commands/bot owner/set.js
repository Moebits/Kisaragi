"use strict";
exports.run = (client, message, args) => {
    let activityType = args[0];
    let activityName = client.combineArgs(args, 1);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tbWFuZHMvYm90IG93bmVyL3NldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQVcsRUFBRSxPQUFZLEVBQUUsSUFBYyxFQUFFLEVBQUU7SUFFeEQsSUFBSSxZQUFZLEdBQVcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25DLElBQUksWUFBWSxHQUFXLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRXZELE1BQU0sYUFBYSxHQUFhLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDbEYsTUFBTSxRQUFRLEdBQVEsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBRTNDLElBQUksTUFBTSxDQUFDLGFBQWEsRUFBRSxFQUFFO1FBRXhCLElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRTtZQUMxRCxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRO2lCQUM1QixjQUFjLENBQUMsdUdBQXVHLENBQUMsQ0FBQyxDQUFDO1NBQzdIO1FBRUQsSUFBSSxZQUFZLEtBQUssV0FBVyxFQUFFO1lBQzlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxFQUFDLEdBQUcsRUFBRSxrQ0FBa0MsRUFBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBQyxDQUFDLENBQUM7WUFDdkcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUTtpQkFDNUIsY0FBYyxDQUFDLFlBQVksWUFBWSxJQUFJLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM3RCxPQUFPO1NBQ1Y7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsRUFBQyxJQUFJLEVBQUUsWUFBWSxFQUFDLENBQUMsQ0FBQztRQUM1RCxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRO2FBQzVCLGNBQWMsQ0FBQyxZQUFZLFlBQVksSUFBSSxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FFaEU7U0FBTTtRQUNILE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVE7YUFDeEIsY0FBYyxDQUFDLHdEQUF3RCxDQUFDLENBQUMsQ0FBQztLQUNsRjtBQUVMLENBQUMsQ0FBQSJ9