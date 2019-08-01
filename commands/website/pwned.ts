import {breaches, breach} from 'hibp';

exports.run = async (client: any, message: any, args: string[]) => {

    if (!args[1]) {
        let result = await breaches();
        let pwnedArray: any = [];
        for (let i in result) {
            let pwnedEmbed = client.createEmbed();
            pwnedEmbed
            .setAuthor("have i been pwned", "https://pbs.twimg.com/profile_images/414900961371377664/eulz0TdB_400x400.png")
            .setTitle(`**Pwned Databases** ${client.getEmoji("sagiriBleh")}`)
            .setURL("https://haveibeenpwned.com/PwnedWebsites")
            .setThumbnail(result[i].LogoPath)
            .setDescription(
                `${client.getEmoji("star")}_Website:_ **${result[i].Name}**\n` +
                `${client.getEmoji("star")}_Breach Date:_ **${client.formatDate(result[i].BreachDate)}**\n` +
                `${client.getEmoji("star")}_Pwned Records:_ **${result[i].PwnCount}**\n` +
                `${client.getEmoji("star")}_Pwned Data:_ **${result[i].DataClasses.join(", ")}**\n` +
                `${client.getEmoji("star")}_Description:_ ${result[i].Description.replace(/<\/?[^>]+(>|$)/g, "")}\n` 
            )
            pwnedArray.push(pwnedEmbed);
        }
        client.createReactionEmbed(pwnedArray);
        return;
    }
    let query = client.combineArgs(args, 1)
    let result: any = await breach(query);
    let pwnedEmbed = client.createEmbed();
            pwnedEmbed
            .setAuthor("have i been pwned", "https://pbs.twimg.com/profile_images/414900961371377664/eulz0TdB_400x400.png")
            .setTitle(`**Pwned Databases** ${client.getEmoji("sagiriBleh")}`)
            .setURL("https://haveibeenpwned.com/PwnedWebsites")
            .setThumbnail(result.LogoPath)
            .setDescription(
                `${client.getEmoji("star")}_Website:_ **${result.Name}**\n` +
                `${client.getEmoji("star")}_Breach Date:_ **${client.formatDate(result.BreachDate)}**\n` +
                `${client.getEmoji("star")}_Pwned Records:_ **${result.PwnCount}**\n` +
                `${client.getEmoji("star")}_Pwned Data:_ **${result.DataClasses.join(", ")}**\n` +
                `${client.getEmoji("star")}_Description:_ ${result.Description.replace(/<\/?[^>]+(>|$)/g, "")}\n` 
            )
            message.channel.send(pwnedEmbed);
}