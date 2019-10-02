import {Emoji, Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Emojis extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const emojis = message.guild!.emojis
        const emojiArray = emojis.map((e: Emoji) => discord.emojis.find((emoji: Emoji) => e.id === emoji.id))
        const nameArray = emojis.map((e: Emoji) => e.name)
        const idArray = emojis.map((e: Emoji) => e.id)
        const createdArray = emojis.map((e: Emoji) => e.createdAt)
        const step = 5.0
        const increment = Math.ceil(emojis.size / step)
        const userEmbedArray: MessageEmbed[] = []
        for (let i = 0; i < increment; i++) {
            const userEmbed = embeds.createEmbed()
            let description = ""
            for (let j = 0; j < step; j++) {
                const value = (i*step)+j
                if (!emojiArray[value]) break
                description += `${discord.getEmoji("star")}_Emoji:_ **${emojiArray[value]}**\n` +
                `${discord.getEmoji("star")}_Emoji Name:_ ${nameArray[value]}\n` +
                `${discord.getEmoji("star")}_Emoji ID:_ ${idArray[value]}\n` +
                `${discord.getEmoji("star")}_Creation Date:_ ${createdArray[value]}\n`
            }
            userEmbed
            .setAuthor("discord", "https://pbs.twimg.com/profile_images/1148340875937718272/sBvqcUJl.jpg")
            .setTitle(`**${message.guild!.name}'s Emojis** ${discord.getEmoji("vigneDead")}`)
            .setThumbnail(message.guild!.iconURL() as string)
            .setDescription(`${discord.getEmoji("star")}_Emoji Count:_ **${emojiArray.length}**\n` + description)
            userEmbedArray.push(userEmbed)
        }
        embeds.createReactionEmbed(userEmbedArray)
    }
}
