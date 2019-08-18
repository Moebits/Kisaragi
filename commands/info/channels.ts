import {Message, GuildChannel, Collection, RichEmbed} from "discord.js";

exports.run = async (discord: any, message: Message, args: string[]) => { 
    let channels: Collection<string, GuildChannel> = message.guild.channels;
    let channelArray: string[] = channels.map((t: GuildChannel) => t.name);
    let idArray: string[] = channels.map((t: GuildChannel) => t.id);
    let createdArray: Date[] = channels.map((t: GuildChannel) => t.createdAt);
    let step: number = 7.0;
    let increment = Math.ceil(channels.size / step);
    let userEmbedArray: RichEmbed[] = [];
    for (let i = 0; i < increment; i++) {
        let userEmbed = discord.createEmbed();
        let description = "";
        for (let j = 0; j < step; j++) {
            let value = (i*step)+j;
            if (!channelArray[value]) break;
            description += `${discord.getEmoji("star")}_Channel:_ **${channelArray[value]}**\n` +
            `${discord.getEmoji("star")}_Channel ID:_ ${idArray[value]}\n` +
            `${discord.getEmoji("star")}_Creation Date:_ ${createdArray[value]}\n`
        }
        userEmbed
        .setAuthor("discord", "https://pbs.twimg.com/profile_images/1148340875937718272/sBvqcUJl.jpg")
        .setTitle(`**${message.guild.name}'s Channels** ${discord.getEmoji("vigneDead")}`)
        .setThumbnail(message.guild.iconURL)
        .setDescription(`${discord.getEmoji("star")}_Channel Count:_ **${channelArray.length}**\n` + description)
        userEmbedArray.push(userEmbed);
    }
    discord.createReactionEmbed(userEmbedArray);
}