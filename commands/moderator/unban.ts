exports.run = async (discord: any, message: any, args: string[]) => {
    if (await discord.checkMod(message)) return;
    const banEmbed: any = discord.createEmbed();
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

    let members: any = [];
    for (let i = 0; i < userArray.length; i++) {
        let member = message.guild.members.find((m: any) => m.id === userArray[i].join(""));
        if (member) {
            members.push(`<@${member.id}>`);
        } else {
            members.push(`<@${userArray[i]}>`);
        }
        banEmbed
        .setTitle(`**You Were Unbanned** ${discord.getEmoji("kannaFU")}`)
        .setDescription(`${discord.getEmoji("star")}_You were unbanned from ${message.guild.name} for reason:_ **${reason}**`);
        try {
            let dm = await member.createDM();
            await dm.send(banEmbed);
        } catch (err) {
            console.log(err);
        }
        await message.guild.unban(member ? member : userArray[i][0], {reason: reason});
    }
    banEmbed
    .setAuthor("unban", "https://discordemoji.com/assets/emoji/bancat.png")
    .setTitle(`**Member Unbanned** ${discord.getEmoji("kannaFU")}`)
    .setDescription(`${discord.getEmoji("star")}_Successfully unbanned ${members.join(", ")} for reason:_ **${reason}**`);
    message.channel.send(banEmbed);
    return;
}