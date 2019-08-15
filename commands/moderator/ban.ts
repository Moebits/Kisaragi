exports.run = async (client: any, message: any, args: string[]) => {

    const banEmbed: any = client.createEmbed();
    const perm: any = client.createPermission("BAN_MEMBERS");
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
            banEmbed
            .setTitle(`**You Were Banned** ${client.getEmoji("kannaFU")}`)
            .setDescription(`${client.getEmoji("star")}_You were banned from ${message.guild.name} for reason:_ **${reason}**`);
            let dm = await member.createDM();
            try {
                await dm.send(banEmbed);
            } catch (err) {
                console.log(err);
            }
            await member.ban(reason);
        }
        banEmbed
        .setAuthor("ban", "https://discordemoji.com/assets/emoji/bancat.png")
        .setTitle(`**Member Banned** ${client.getEmoji("kannaFU")}`)
        .setDescription(`${client.getEmoji("star")}_Successfully banned ${members.join(", ")} for reason:_ **${reason}**`);
        message.channel.send(banEmbed);
        return;
        
    } else {
        banEmbed
        .setDescription("You do not have the ban members permission!");
        message.channel.send(banEmbed);
        return;
    }
}