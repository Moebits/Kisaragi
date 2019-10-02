import {Message} from "discord.js"
import * as nasa from "nasa-sdk"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Nasa extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        nasa.setNasaApiKey(process.env.NASA_API_KEY)
        const nasaEmbed = embeds.createEmbed()

        const data = await nasa.APOD.fetch()
        const checkedMessage = Functions.checkChar(data.explanation, 1900, ".")
        nasaEmbed
        .setAuthor("nasa", "https://cdn.mos.cms.futurecdn.net/baYs9AuHxx9QXeYBiMvSLU.jpg")
        .setTitle(`**Nasa Picture** ${discord.getEmoji("cute")}`)
        if (data.media_type === "video") {
        nasaEmbed
        .setURL(data.url)
        .setDescription(
        `${discord.getEmoji("star")}_Title:_ **${data.title}**\n` +
        `${discord.getEmoji("star")}_Date:_ **${Functions.formatDate(data.date)}**\n` +
        `${discord.getEmoji("star")}_Explanation:_ **${checkedMessage}**\n`
        )
        .setImage(data.url)
        .setThumbnail(message.author!.displayAvatarURL())
        }
        message.channel.send(nasaEmbed)
    }
}
