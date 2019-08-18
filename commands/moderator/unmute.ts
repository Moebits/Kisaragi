exports.run = async (discord: any, message: any, args: string[]) => {

    const muteEmbed: any = discord.createEmbed();
    const perm: any = discord.createPermission("MANAGE_ROLES");
    let mute = await discord.fetchColumn("special roles", "mute role");
    if (!mute) return message.reply("You need to set a mute role first!");
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
            await member.removeRole(mute.join(""));
            members.push(`<@${member.id}>`);
            let dm = await member.createDM();
            muteEmbed
            .setAuthor("unmute", "https://images.emojiterra.com/mozilla/512px/1f507.png")
            .setTitle(`**You Were Unmuted** ${discord.getEmoji("kannaFU")}`)
            .setDescription(`${discord.getEmoji("star")}_You were unmuted in ${message.guild.name} for reason:_ **${reason}**`);
            await dm.send(muteEmbed);
        }
        muteEmbed
        .setAuthor("unmute", "https://images.emojiterra.com/mozilla/512px/1f507.png")
        .setTitle(`**Member Unmuted** ${discord.getEmoji("kannaFU")}`)
        .setDescription(`${discord.getEmoji("star")}_Successfully unmuted ${members.join(", ")} for reason:_ **${reason}**`);
        message.channel.send(muteEmbed);
        return;
        
    } else {
        muteEmbed
        .setDescription("You do not have the manage roles permission!");
        message.channel.send(muteEmbed);
        return;
    }
}