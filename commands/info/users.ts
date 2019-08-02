import {SnowflakeUtil, Message, GuildMember, Collection, RichEmbed} from "discord.js";

exports.run = async (client: any, message: Message, args: string[]) => { 
    let members: Collection<string, GuildMember> = message.guild.members
    let userArray: string[] = members.map((m: GuildMember) => `${m.user.username}#${m.user.discriminator}`);
    let idArray: string[] = members.map((m: GuildMember) => m.user.id);
    let joinArray: Date[] = members.map((m: GuildMember) => {
        let snowflake = SnowflakeUtil.deconstruct(m.joinedTimestamp.toString());
        return snowflake.date;
    });
    let step: number = 7.0;
    let increment = Math.ceil(members.size / step);
    let userEmbedArray: RichEmbed[] = [];
    for (let i = 0; i < increment; i++) {
        let userEmbed = client.createEmbed();
        let description = "";
        for (let j = 0; j < step; j++) {
            let value = (i*step)+j;
            if (!userArray[value]) break;
            description += `${client.getEmoji("star")}_User:_ **${userArray[value]}**\n` +
            `${client.getEmoji("star")}_User ID:_ ${idArray[value]}\n` +
            `${client.getEmoji("star")}_Join Date:_ ${joinArray[value]}\n`
        }
        userEmbed
        .setAuthor("discord", "https://pbs.twimg.com/profile_images/1148340875937718272/sBvqcUJl.jpg")
        .setTitle(`**${message.guild.name}'s Members** ${client.getEmoji("vigneDead")}`)
        .setThumbnail(message.guild.iconURL)
        .setDescription(`${client.getEmoji("star")}_Member Count:_ **${message.guild.memberCount}**\n` + description)
        userEmbedArray.push(userEmbed);
    }
    client.createReactionEmbed(userEmbedArray);
}