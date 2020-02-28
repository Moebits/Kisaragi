import {GuildChannel, Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Channels extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Lists all channels in the guild.",
            aliases: [],
            cooldown: 3
        })
    }

    public run = (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const channels = message.guild!.channels
        const channelArray = channels.cache.map((t: GuildChannel) => t.name)
        const idArray = channels.cache.map((t: GuildChannel) => t.id)
        const createdArray = channels.cache.map((t: GuildChannel) => t.createdAt)
        const step = 7.0
        const increment = Math.ceil(channels.cache.size / step)
        const userEmbedArray: MessageEmbed[] = []
        for (let i = 0; i < increment; i++) {
            const userEmbed = embeds.createEmbed()
            let description = ""
            for (let j = 0; j < step; j++) {
                const value = (i*step)+j
                if (!channelArray[value]) break
                description += `${discord.getEmoji("star")}_Channel:_ **${channelArray[value]}**\n` +
                `${discord.getEmoji("star")}_Channel ID:_ ${idArray[value]}\n` +
                `${discord.getEmoji("star")}_Creation Date:_ ${createdArray[value]}\n`
            }
            userEmbed
            .setAuthor("discord", "https://pbs.twimg.com/profile_images/1148340875937718272/sBvqcUJl.jpg")
            .setTitle(`**${message.guild!.name}'s Channels** ${discord.getEmoji("vigneDead")}`)
            .setThumbnail(message.guild!.iconURL() as string)
            .setDescription(`${discord.getEmoji("star")}_Channel Count:_ **${channelArray.length}**\n` + description)
            userEmbedArray.push(userEmbed)
        }
        embeds.createReactionEmbed(userEmbedArray)
    }
}
