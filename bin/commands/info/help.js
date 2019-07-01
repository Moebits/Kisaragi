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
    message.channel.send(helpEmbedInfo)
        .catch(error => console.log("Caught", error.message));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbW1hbmRzL2luZm8vaGVscC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRTtJQUVwQyxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDdkMsYUFBYTtTQUNaLFFBQVEsQ0FBQyxpQ0FBaUMsQ0FBQztTQUMzQyxZQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7U0FDdEMsU0FBUyxDQUFDLHdCQUF3QixFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO1NBQzFELFFBQVEsQ0FBQyxpQkFBaUIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO1NBQ3hELGNBQWMsQ0FBQyxrREFBa0QsQ0FBQztTQUNsRSxRQUFRLENBQUMsUUFBUSxFQUFFLGdDQUFnQyxDQUFDO1NBQ3BELFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxnQ0FBZ0MsQ0FBQztTQUMvRCxRQUFRLENBQUMseUJBQXlCLEVBQUUsZ0RBQWdELENBQUMsQ0FBQztJQUUzRixPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7U0FDbEMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFFMUQsQ0FBQyxDQUFBIn0=