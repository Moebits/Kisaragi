import {Guild, Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Guilds extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const guilds = discord.guilds
        const guildArray = guilds.map((g: Guild) => g.name)
        const idArray = guilds.map((g: Guild) => g.id)
        const createdArray = guilds.map((g: Guild) => g.createdAt)
        const step = 7.0
        const increment = Math.ceil(guilds.size / step)
        const userEmbedArray: MessageEmbed[] = []
        for (let i = 0; i < increment; i++) {
            const userEmbed = embeds.createEmbed()
            let description = ""
            for (let j = 0; j < step; j++) {
                const value = (i*step)+j
                if (!guildArray[value]) break
                description += `${discord.getEmoji("star")}_Guild:_ **${guildArray[value]}**\n` +
                `${discord.getEmoji("star")}_Guild ID:_ ${idArray[value]}\n` +
                `${discord.getEmoji("star")}_Creation Date:_ ${createdArray[value]}\n`
            }
            userEmbed
            .setAuthor("discord", "https://pbs.twimg.com/profile_images/1148340875937718272/sBvqcUJl.jpg")
            .setTitle(`**${discord.user!.username}'s Guilds** ${discord.getEmoji("vigneDead")}`)
            .setThumbnail(message.guild!.iconURL() as string)
            .setDescription(`${discord.getEmoji("star")}_Guild Count:_ **${guildArray.length}**\n` + description)
            userEmbedArray.push(userEmbed)
        }
        embeds.createReactionEmbed(userEmbedArray)
    }
}
