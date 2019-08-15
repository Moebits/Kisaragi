exports.run = async (client: any, message: any, args: string[]) => {

    const restrictEmbed: any = client.createEmbed();
    const perm: any = client.createPermission("MANAGE_ROLES");
    let restrict = await client.fetchColumn("special roles", "restricted role");
    if (!restrict) return message.reply("You need to set a restricted role first!");
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
            await member.removeRole(restrict.join(""));
            members.push(`<@${member.id}>`);
            let dm = await member.createDM();
            restrictEmbed
            .setAuthor("unrestrict", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/mozilla/36/no-entry-sign_1f6ab.png")
            .setTitle(`**You Were Unrestricted** ${client.getEmoji("kannaFU")}`)
            .setDescription(`${client.getEmoji("star")}_You were unrestricted in ${message.guild.name} for reason:_ **${reason}**`);
            await dm.send(restrictEmbed);
        }
        restrictEmbed
        .setAuthor("restrict", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/mozilla/36/no-entry-sign_1f6ab.png")
        .setTitle(`**Member Unrestricted** ${client.getEmoji("kannaFU")}`)
        .setDescription(`${client.getEmoji("star")}_Successfully unrestricted ${members.join(", ")} for reason:_ **${reason}**`);
        message.channel.send(restrictEmbed);
        return;
        
    } else {
        restrictEmbed
        .setDescription("You do not have the manage roles permission!");
        message.channel.send(restrictEmbed);
        return;
    }
}