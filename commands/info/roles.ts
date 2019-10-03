import {Message, MessageEmbed, Role} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Roles extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public run = (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const roles = message.guild!.roles
        const roleArray = roles.map((r: Role) => r.name)
        const idArray = roles.map((r: Role) => r.id)
        const createdArray = roles.map((r: Role) => r.createdAt)
        const step = 7.0
        const increment = Math.ceil(roles.size / step)
        const userEmbedArray: MessageEmbed[] = []
        for (let i = 0; i < increment; i++) {
            const userEmbed = embeds.createEmbed()
            let description = ""
            for (let j = 0; j < step; j++) {
                const value = (i*step)+j
                if (!roleArray[value]) break
                description += `${discord.getEmoji("star")}_Role:_ **${roleArray[value]}**\n` +
                `${discord.getEmoji("star")}_Role ID:_ ${idArray[value]}\n` +
                `${discord.getEmoji("star")}_Creation Date:_ ${createdArray[value]}\n`
            }
            userEmbed
            .setAuthor("discord", "https://pbs.twimg.com/profile_images/1148340875937718272/sBvqcUJl.jpg")
            .setTitle(`**${message.guild!.name}'s Roles** ${discord.getEmoji("vigneDead")}`)
            .setThumbnail(message.guild!.iconURL() as string)
            .setDescription(`${discord.getEmoji("star")}_Role Count:_ **${roleArray.length}**\n` + description)
            userEmbedArray.push(userEmbed)
        }
        embeds.createReactionEmbed(userEmbedArray)
    }
}
