exports.run = (discord: any, message: any, args: string[]) => {

    let ownerID: any = process.env.OWNER_ID;
    let activityType: string = args[1];
    let activityName: string = discord.combineArgs(args, 2);

    const activityTypes: string[] = ["playing", "watching", "listening", "streaming"];
    const setEmbed: any = discord.createEmbed();

    if (message.author.id === ownerID) {

        if (!activityName || (!activityTypes.includes(activityType))) {
            message.channel.send(setEmbed
            .setDescription("Correct usage is =>set (type) (activity), where (type) is playing, watching, listening, or streaming."));
        }

        if (activityType === "streaming") {
            discord.user.setActivity(activityName, {url: "https://www.twitch.tv/tenpimusic"}, {type: activityType});
            message.channel.send(setEmbed
            .setDescription(`I am now ${activityType} ${activityName}`));
            return;
        }
            
        discord.user.setActivity(activityName, {type: activityType});
        message.channel.send(setEmbed
        .setDescription(`I am now ${activityType} ${activityName}`));

    } else {
        message.channel.send(setEmbed
            .setDescription("In order to use this command, you must be a bot owner."));
    }
        
}