import {Message, Role, Collection, RichEmbed} from "discord.js";

exports.run = async (discord: any, message: Message, args: string[]) => { 
    let roles: Collection<string, Role> = message.guild.roles
    let roleArray: string[] = roles.map((r: Role) => r.name);
    let idArray: string[] = roles.map((r: Role) => r.id);
    let createdArray: Date[] = roles.map((r: Role) => r.createdAt);
    let step: number = 7.0;
    let increment = Math.ceil(roles.size / step);
    let userEmbedArray: RichEmbed[] = [];
    for (let i = 0; i < increment; i++) {
        let userEmbed = discord.createEmbed();
        let description = "";
        for (let j = 0; j < step; j++) {
            let value = (i*step)+j;
            if (!roleArray[value]) break;
            description += `${discord.getEmoji("star")}_Role:_ **${roleArray[value]}**\n` +
            `${discord.getEmoji("star")}_Role ID:_ ${idArray[value]}\n` +
            `${discord.getEmoji("star")}_Creation Date:_ ${createdArray[value]}\n`
        }
        userEmbed
        .setAuthor("discord", "https://pbs.twimg.com/profile_images/1148340875937718272/sBvqcUJl.jpg")
        .setTitle(`**${message.guild.name}'s Roles** ${discord.getEmoji("vigneDead")}`)
        .setThumbnail(message.guild.iconURL)
        .setDescription(`${discord.getEmoji("star")}_Role Count:_ **${roleArray.length}**\n` + description)
        userEmbedArray.push(userEmbed);
    }
    discord.createReactionEmbed(userEmbedArray);
}