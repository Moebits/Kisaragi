import {breaches, breach} from 'hibp';

exports.run = async (discord: any, message: any, args: string[]) => {

    if (!args[1]) {
        let result = await breaches();
        let pwnedArray: any = [];
        for (let i in result) {
            let pwnedEmbed = discord.createEmbed();
            pwnedEmbed
            .setAuthor("have i been pwned", "https://pbs.twimg.com/profile_images/414900961371377664/eulz0TdB_400x400.png")
            .setTitle(`**Pwned Databases** ${discord.getEmoji("sagiriBleh")}`)
            .setURL("https://haveibeenpwned.com/PwnedWebsites")
            .setThumbnail(result[i].LogoPath)
            .setDescription(
                `${discord.getEmoji("star")}_Website:_ **${result[i].Name}**\n` +
                `${discord.getEmoji("star")}_Breach Date:_ **${discord.formatDate(result[i].BreachDate)}**\n` +
                `${discord.getEmoji("star")}_Pwned Records:_ **${result[i].PwnCount}**\n` +
                `${discord.getEmoji("star")}_Pwned Data:_ **${result[i].DataClasses.join(", ")}**\n` +
                `${discord.getEmoji("star")}_Description:_ ${result[i].Description.replace(/<\/?[^>]+(>|$)/g, "")}\n` 
            )
            pwnedArray.push(pwnedEmbed);
        }
        discord.createReactionEmbed(pwnedArray);
        return;
    }
    let query = discord.combineArgs(args, 1)
    let result: any = await breach(query);
    let pwnedEmbed = discord.createEmbed();
            pwnedEmbed
            .setAuthor("have i been pwned", "https://pbs.twimg.com/profile_images/414900961371377664/eulz0TdB_400x400.png")
            .setTitle(`**Pwned Databases** ${discord.getEmoji("sagiriBleh")}`)
            .setURL("https://haveibeenpwned.com/PwnedWebsites")
            .setThumbnail(result.LogoPath)
            .setDescription(
                `${discord.getEmoji("star")}_Website:_ **${result.Name}**\n` +
                `${discord.getEmoji("star")}_Breach Date:_ **${discord.formatDate(result.BreachDate)}**\n` +
                `${discord.getEmoji("star")}_Pwned Records:_ **${result.PwnCount}**\n` +
                `${discord.getEmoji("star")}_Pwned Data:_ **${result.DataClasses.join(", ")}**\n` +
                `${discord.getEmoji("star")}_Description:_ ${result.Description.replace(/<\/?[^>]+(>|$)/g, "")}\n` 
            )
            message.channel.send(pwnedEmbed);
}