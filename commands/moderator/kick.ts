exports.run = async (client: any, message: any, args: string[]) => {

    const kickEmbed: any = client.createEmbed();
    const perm: any = client.createPermission("KICK_MEMBERS");
    let reasonArray: any = [];
    let userArray: any = [];

    for (let i = 1; i < args.length; i++) {
        if (args[i].match(/\d+/g)) {
            userArray.push(args[i].match(/\d+/g))[0];
        } else {
            reasonArray.push(args[i]);
        }
    }

    let reason = reasonArray.join("") ? reasonArray.join(" ") : "None provided!"

    if (message.member.hasPermission(perm)) {
        let members: any = [];
        for (let i = 0; i < userArray.length; i++) {
            let member = message.guild.members.find((m: any) => m.id === userArray[i].join(""));
            members.push(`<@${member.id}>`);
            kickEmbed
            .setAuthor("kick", "https://discordemoji.com/assets/emoji/4331_UmaruWave.png")
            .setTitle(`**You Were Kicked** ${client.getEmoji("kannaFU")}`)
            .setDescription(`${client.getEmoji("star")}_You were kicked from ${message.guild.name} for reason:_ **${reason}**`);
            let dm = await member.createDM();
            try {
                await dm.send(kickEmbed);
            } catch (err) {
                console.log(err);
            }
            await member.kick(reason);
        }
        kickEmbed
        .setAuthor("kick", "https://discordemoji.com/assets/emoji/4331_UmaruWave.png")
        .setTitle(`**Member Kicked** ${client.getEmoji("kannaFU")}`)
        .setDescription(`${client.getEmoji("star")}_Successfully kicked ${members.join(", ")} for reason:_ **${reason}**`);
        message.channel.send(kickEmbed);
        return;
        
    } else {
        kickEmbed
        .setDescription("You do not have the kick members permission!");
        message.channel.send(kickEmbed);
        return;
    }
}