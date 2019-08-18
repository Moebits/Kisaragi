exports.run = async (discord: any, message: any, args: string[]) => {

    const restrictEmbed: any = discord.createEmbed();
    const perm: any = discord.createPermission("MANAGE_ROLES");
    let restrict = await discord.fetchColumn("special roles", "restricted role");
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
            await member.addRole(restrict.join(""));
            members.push(`<@${member.id}>`);
            let dm = await member.createDM();
            restrictEmbed
            .setAuthor("restrict", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/mozilla/36/no-entry-sign_1f6ab.png")
            .setTitle(`**You Were Restricted** ${discord.getEmoji("kannaFU")}`)
            .setDescription(`${discord.getEmoji("star")}_You were restricted in ${message.guild.name} for reason:_ **${reason}**`);
            await dm.send(restrictEmbed);
        }
        restrictEmbed
        .setAuthor("restrict", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/mozilla/36/no-entry-sign_1f6ab.png")
        .setTitle(`**Member Restricted** ${discord.getEmoji("kannaFU")}`)
        .setDescription(`${discord.getEmoji("star")}_Successfully restricted ${members.join(", ")} for reason:_ **${reason}**`);
        message.channel.send(restrictEmbed);
        return;
        
    } else {
        restrictEmbed
        .setDescription("You do not have the manage roles permission!");
        message.channel.send(restrictEmbed);
        return;
    }
}