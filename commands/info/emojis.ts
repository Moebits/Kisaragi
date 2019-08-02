import {Message, Emoji, Collection, RichEmbed} from "discord.js";

exports.run = async (client: any, message: Message, args: string[]) => { 
    let emojis: Collection<string, Emoji> = message.guild.emojis;
    let emojiArray: string[] = emojis.map((e: Emoji) => client.emojis.find((emoji: Emoji) => e.id === emoji.id));
    let nameArray: string[] = emojis.map((e: Emoji) => e.name);
    let idArray: string[] = emojis.map((e: Emoji) => e.id);
    let createdArray: Date[] = emojis.map((e: Emoji) => e.createdAt);
    let step: number = 5.0;
    let increment = Math.ceil(emojis.size / step);
    let userEmbedArray: RichEmbed[] = [];
    for (let i = 0; i < increment; i++) {
        let userEmbed = client.createEmbed();
        let description = "";
        for (let j = 0; j < step; j++) {
            let value = (i*step)+j;
            if (!emojiArray[value]) break;
            description += `${client.getEmoji("star")}_Emoji:_ **${emojiArray[value]}**\n` +
            `${client.getEmoji("star")}_Emoji Name:_ ${nameArray[value]}\n` +
            `${client.getEmoji("star")}_Emoji ID:_ ${idArray[value]}\n` +
            `${client.getEmoji("star")}_Creation Date:_ ${createdArray[value]}\n`
        }
        userEmbed
        .setAuthor("discord", "https://pbs.twimg.com/profile_images/1148340875937718272/sBvqcUJl.jpg")
        .setTitle(`**${message.guild.name}'s Emojis** ${client.getEmoji("vigneDead")}`)
        .setThumbnail(message.guild.iconURL)
        .setDescription(`${client.getEmoji("star")}_Emoji Count:_ **${emojiArray.length}**\n` + description)
        userEmbedArray.push(userEmbed);
    }
    client.createReactionEmbed(userEmbedArray);
}