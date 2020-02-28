import {GuildEmoji, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Emoji extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Posts the image of an emoji.",
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)

        const emojiEmbed = embeds.createEmbed()
        .setTitle(`**Emoji Search** ${discord.getEmoji("gabStare")}`)
        const emojiName = args[1]

        const emojiID = String(emojiName.replace(/(?<=:)(.*?)(?=:)/g, "").match(/\d+/))

        if (emojiID === "null") {
            const emojiFound = discord.emojis.cache.find((emoji: GuildEmoji) => emoji.name.toLowerCase() === emojiName.toLowerCase())
            if (emojiFound === undefined) {
                message.channel.send(emojiEmbed
                .setDescription("Could not find that emoji!"))
                return
            }

            message.channel.send(emojiEmbed
            .setDescription(`**${emojiFound!.name} Emoji**`)
            .setImage(`${emojiFound!.url}`))
            return

            } else {
                const emojiGet = discord.emojis.cache.get(emojiID)
                message.channel.send(emojiEmbed
                .setDescription(`**${emojiGet!.name} Emoji**`)
                .setImage(emojiGet!.url))
                return
            }
    }
}
