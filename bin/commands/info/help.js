"use strict";
exports.run = (client, message, args) => {
    const helpEmbedInfo = client.createEmbed();
    helpEmbedInfo
        .setImage("https://i.imgur.com/Av9RN7x.png")
        .setThumbnail(message.author.avatarURL)
        .setFooter("Page 1 • Info Commands", message.guild.iconURL)
        .setTitle(`Info Commands ${client.getEmoji("gabTired")}`)
        .setDescription("Click on the reactions to scroll to other pages!")
        .addField("=>help", "Shows all of the bot commands.")
        .addField("=>prefix (prefix)", "Changes the prefix of the bot.")
        .addField("=>set (activity) (type)", "Sets the bot's activity. Required -> Bot Owner");
    message.channel.send(helpEmbedInfo);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbW1hbmRzL2luZm8vaGVscC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQVcsRUFBRSxPQUFZLEVBQUUsSUFBYyxFQUFFLEVBQUU7SUFFeEQsTUFBTSxhQUFhLEdBQVEsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzVDLGFBQWE7U0FDWixRQUFRLENBQUMsaUNBQWlDLENBQUM7U0FDM0MsWUFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO1NBQ3RDLFNBQVMsQ0FBQyx3QkFBd0IsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztTQUMxRCxRQUFRLENBQUMsaUJBQWlCLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztTQUN4RCxjQUFjLENBQUMsa0RBQWtELENBQUM7U0FDbEUsUUFBUSxDQUFDLFFBQVEsRUFBRSxnQ0FBZ0MsQ0FBQztTQUNwRCxRQUFRLENBQUMsbUJBQW1CLEVBQUUsZ0NBQWdDLENBQUM7U0FDL0QsUUFBUSxDQUFDLHlCQUF5QixFQUFFLGdEQUFnRCxDQUFDLENBQUM7SUFFM0YsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7QUFFdkMsQ0FBQyxDQUFBIn0=