const responseObject = {
    "gab": "Gab is the best girl"
};
module.exports = (client, message) => {
    require("../modules/message-functions.js")(client, message);
    let config = require("../../config.json");
    let prefix = config.prefix;
    if (client.checkBotMention(message)) {
        const prefixHelpEmbed = client.createEmbed();
        prefixHelpEmbed
            .setDescription(`My prefix is set to "${prefix}"!\nType ${prefix}help if you need help.`);
        message.channel.send(prefixHelpEmbed);
    }
    if (client.checkPrefixUser(message)) {
        return;
    }
    if (responseObject[message.content]) {
        return message.channel.send(responseObject[message.content]);
    }
    //Load Commands
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command);
    if (!cmd)
        return;
    cmd.run(client, message, args);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2V2ZW50cy9tZXNzYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sY0FBYyxHQUFHO0lBQ25CLEtBQUssRUFBRSxzQkFBc0I7Q0FDaEMsQ0FBQTtBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLEVBQUU7SUFFakMsT0FBTyxDQUFDLGlDQUFpQyxDQUFDLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRTVELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQzFDLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFFM0IsSUFBSSxNQUFNLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ2pDLE1BQU0sZUFBZSxHQUFHLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUM3QyxlQUFlO2FBQ2QsY0FBYyxDQUFDLHdCQUF3QixNQUFNLFlBQVksTUFBTSx3QkFBd0IsQ0FBQyxDQUFBO1FBQ3pGLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQ3pDO0lBRUQsSUFBSSxNQUFNLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ2pDLE9BQU87S0FDVjtJQUVELElBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUNoQyxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztLQUNoRTtJQUVELGVBQWU7SUFDZixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3RFLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUMzQyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN6QyxJQUFJLENBQUMsR0FBRztRQUFFLE9BQU87SUFFakIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ25DLENBQUMsQ0FBQSJ9