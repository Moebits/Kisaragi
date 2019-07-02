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
    const props = require(`../${commandDir}/${commandName}.js`);
    client.commands.set(commandName, props);
    message.channel.send(reloadEmbed
        .setDescription(`The command **${commandName}** has been reloaded!`));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVsb2FkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tbWFuZHMvYm90IG93bmVyL3JlbG9hZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRTtJQUV0QyxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDekMsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVCLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUUzQixJQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ1gsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXO2FBQ3RDLGNBQWMsQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDLENBQUM7S0FDL0Q7SUFFRCxJQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUU7UUFDcEMsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXO2FBQ3RDLGNBQWMsQ0FBQyxHQUFHLFdBQVcsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO0tBQ25EO0lBRUQsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxVQUFVLElBQUksV0FBVyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBRTVFLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3BDLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxNQUFNLFVBQVUsSUFBSSxXQUFXLEtBQUssQ0FBQyxDQUFDO0lBQzVELE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN4QyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXO1NBQy9CLGNBQWMsQ0FBQyxpQkFBaUIsV0FBVyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7QUFDeEUsQ0FBQyxDQUFBIn0=