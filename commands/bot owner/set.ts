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
            client.user.setActivity(activityName, {url: "https://www.twitch.tv/tenpimusic"}, {type: activityType});
            message.channel.send(setEmbed
            .setDescription(`I am now ${activityType} ${activityName}`));
            return;
        }
            
        client.user.setActivity(activityName, {type: activityType});
        message.channel.send(setEmbed
        .setDescription(`I am now ${activityType} ${activityName}`));

    } else {
        message.channel.send(setEmbed
            .setDescription("In order to use this command, you must be a bot owner."));
    }
        
}