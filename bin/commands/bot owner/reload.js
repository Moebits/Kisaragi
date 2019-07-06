"use strict";
exports.run = (client, message, args) => {
    const reloadEmbed = client.createEmbed();
    const commandName = args[0];
    const commandDir = args[1];
    if (!args[1]) {
        return message.channel.send(reloadEmbed
            .setDescription(`Correct usage is =>reload (command) (dir)`));
    }
    if (!client.commands.has(commandName)) {
        return message.channel.send(reloadEmbed
            .setDescription(`${commandName} does not exist`));
    }
    delete require.cache[require.resolve(`../${commandDir}/${commandName}.js`)];
    client.commands.delete(commandName);
    const fileName = require(`../${commandDir}/${commandName}.js`);
    client.commands.set(commandName, fileName);
    message.channel.send(reloadEmbed
        .setDescription(`The command **${commandName}** has been reloaded!`));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVsb2FkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tbWFuZHMvYm90IG93bmVyL3JlbG9hZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQVcsRUFBRSxPQUFZLEVBQUUsSUFBYyxFQUFFLEVBQUU7SUFFMUQsTUFBTSxXQUFXLEdBQVEsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzlDLE1BQU0sV0FBVyxHQUFXLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwQyxNQUFNLFVBQVUsR0FBVyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFbkMsSUFBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNYLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVzthQUN0QyxjQUFjLENBQUMsMkNBQTJDLENBQUMsQ0FBQyxDQUFDO0tBQy9EO0lBRUQsSUFBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFO1FBQ3BDLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVzthQUN0QyxjQUFjLENBQUMsR0FBRyxXQUFXLGlCQUFpQixDQUFDLENBQUMsQ0FBQztLQUNuRDtJQUVELE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sVUFBVSxJQUFJLFdBQVcsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUU1RSxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNwQyxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxVQUFVLElBQUksV0FBVyxLQUFLLENBQUMsQ0FBQztJQUMvRCxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDM0MsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVztTQUMvQixjQUFjLENBQUMsaUJBQWlCLFdBQVcsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO0FBQ3hFLENBQUMsQ0FBQSJ9