import {Message, Guild, Collection, RichEmbed} from "discord.js";

exports.run = async (discord: any, message: Message, args: string[]) => { 
    let guilds: Collection<string, Guild> = discord.guilds
    let guildArray: string[] = guilds.map((g: Guild) => g.name);
    let idArray: string[] = guilds.map((g: Guild) => g.id);
    let createdArray: Date[] = guilds.map((g: Guild) => g.createdAt);
    let step: number = 7.0;
    let increment = Math.ceil(guilds.size / step);
    let userEmbedArray: RichEmbed[] = [];
    for (let i = 0; i < increment; i++) {
        let userEmbed = discord.createEmbed();
        let description = "";
        for (let j = 0; j < step; j++) {
            let value = (i*step)+j;
            if (!guildArray[value]) break;
            description += `${discord.getEmoji("star")}_Guild:_ **${guildArray[value]}**\n` +
            `${discord.getEmoji("star")}_Guild ID:_ ${idArray[value]}\n` +
            `${discord.getEmoji("star")}_Creation Date:_ ${createdArray[value]}\n`
        }
        userEmbed
        .setAuthor("discord", "https://pbs.twimg.com/profile_images/1148340875937718272/sBvqcUJl.jpg")
        .setTitle(`**${discord.user.username}'s Guilds** ${discord.getEmoji("vigneDead")}`)
        .setThumbnail(message.guild.iconURL)
        .setDescription(`${discord.getEmoji("star")}_Guild Count:_ **${guildArray.length}**\n` + description)
        userEmbedArray.push(userEmbed);
    }
    discord.createReactionEmbed(userEmbedArray);
}