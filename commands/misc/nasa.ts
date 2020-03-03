import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

const nasa = require("nasa-sdk")

export default class Nasa extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Posts the nasa image of the day.",
            help:
            `
            \`nasa\` - Posts the astronomy picture of the day
            `,
            examples:
            `
            \`=>nasa\`
            `,
            aliases: [],
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
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
