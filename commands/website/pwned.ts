import {Message} from "discord.js"
import {breach, breaches} from "hibp"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Pwned extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)

        if (!args[1]) {
            const result = await breaches()
            const pwnedArray: any = []
            for (let i = 0; i < result.length; i++) {
                const pwnedEmbed = embeds.createEmbed()
                pwnedEmbed
                .setAuthor("have i been pwned", "https://pbs.twimg.com/profile_images/414900961371377664/eulz0TdB_400x400.png")
                .setTitle(`**Pwned Databases** ${discord.getEmoji("sagiriBleh")}`)
                .setURL("https://haveibeenpwned.com/PwnedWebsites")
                .setThumbnail(result[i].LogoPath)
                .setDescription(
                    `${discord.getEmoji("star")}_Website:_ **${result[i].Name}**\n` +
                    `${discord.getEmoji("star")}_Breach Date:_ **${Functions.formatDate(new Date(result[i].BreachDate))}**\n` +
                    `${discord.getEmoji("star")}_Pwned Records:_ **${result[i].PwnCount}**\n` +
                    `${discord.getEmoji("star")}_Pwned Data:_ **${result[i].DataClasses.join(", ")}**\n` +
                    `${discord.getEmoji("star")}_Description:_ ${result[i].Description.replace(/<\/?[^>]+(>|$)/g, "")}\n`
                )
                pwnedArray.push(pwnedEmbed)
            }
            embeds.createReactionEmbed(pwnedArray)
            return
        }
        const query = Functions.combineArgs(args, 1)
        const result: any = await breach(query)
        const pwnedEmbed = embeds.createEmbed()
        pwnedEmbed
                .setAuthor("have i been pwned", "https://pbs.twimg.com/profile_images/414900961371377664/eulz0TdB_400x400.png")
                .setTitle(`**Pwned Databases** ${discord.getEmoji("sagiriBleh")}`)
                .setURL("https://haveibeenpwned.com/PwnedWebsites")
                .setThumbnail(result.LogoPath)
                .setDescription(
                    `${discord.getEmoji("star")}_Website:_ **${result.Name}**\n` +
                    `${discord.getEmoji("star")}_Breach Date:_ **${Functions.formatDate(result.BreachDate)}**\n` +
                    `${discord.getEmoji("star")}_Pwned Records:_ **${result.PwnCount}**\n` +
                    `${discord.getEmoji("star")}_Pwned Data:_ **${result.DataClasses.join(", ")}**\n` +
                    `${discord.getEmoji("star")}_Description:_ ${result.Description.replace(/<\/?[^>]+(>|$)/g, "")}\n`
                )
        message.channel.send(pwnedEmbed)
    }
}
