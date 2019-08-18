exports.run = async (discord: any, message: any, args: string[]) => {

    const remEmbed: any = discord.createEmbed();
    const perm: any = discord.createPermission("MANAGE_CHANNELS");

    if (message.member.hasPermission(perm)) {
        let nameArray = message.guild.channels.map((c: any) => c.name);
        let idArray = message.guild.channels.map((c: any) => c.id);
        for (let i = 0; i < nameArray.length; i++) {
            if (nameArray[i].includes("-")) {
                let newName = nameArray[i].replace(/-/g, " ");
                let channel = message.guild.channels.find((c: any) => c.id === idArray[i]);
                await channel.setName(newName);
            }
        }
        remEmbed
        .setDescription("Removed dashes from all channel names!");
        message.channel.send(remEmbed);
        return;
        
    } else {
        remEmbed
        .setDescription("You do not have the manage channels permission!");
        message.channel.send(remEmbed);
        return;
    }
    
}