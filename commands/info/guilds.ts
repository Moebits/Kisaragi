import {Message, Guild, Collection, RichEmbed} from "discord.js";

exports.run = async (client: any, message: Message, args: string[]) => { 
    let guilds: Collection<string, Guild> = client.guilds
    let guildArray: string[] = guilds.map((g: Guild) => g.name);
    let idArray: string[] = guilds.map((g: Guild) => g.id);
    let createdArray: Date[] = guilds.map((g: Guild) => g.createdAt);
    let step: number = 7.0;
    let increment = Math.ceil(guilds.size / step);
    let userEmbedArray: RichEmbed[] = [];
    for (let i = 0; i < increment; i++) {
        let userEmbed = client.createEmbed();
        let description = "";
        for (let j = 0; j < step; j++) {
            let value = (i*step)+j;
            if (!guildArray[value]) break;
            description += `${client.getEmoji("star")}_Guild:_ **${guildArray[value]}**\n` +
            `${client.getEmoji("star")}_Guild ID:_ ${idArray[value]}\n` +
            `${client.getEmoji("star")}_Creation Date:_ ${createdArray[value]}\n`
        }
        userEmbed
        .setAuthor("discord", "https://pbs.twimg.com/profile_images/1148340875937718272/sBvqcUJl.jpg")
        .setTitle(`**${client.user.username}'s Guilds** ${client.getEmoji("vigneDead")}`)
        .setThumbnail(message.guild.iconURL)
        .setDescription(`${client.getEmoji("star")}_Guild Count:_ **${guildArray.length}**\n` + description)
        userEmbedArray.push(userEmbed);
    }
    client.createReactionEmbed(userEmbedArray);
}