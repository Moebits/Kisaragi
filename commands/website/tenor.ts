import {Message} from "discord.js"
import Tenor from "tenorjs"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class TenorCommand extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const tenor = new Tenor.client({
            Key: process.env.TENOR_API_KEY,
            Filter: "off",
            Locale: "en_US",
            MediaFilter: "minimal",
            DateFormat: "MM/DD/YYYY"
        })

        const query = Functions.combineArgs(args, 1)
        const tenorEmbed = embeds.createEmbed()
        const result = query ? await tenor.Search.Random(query, "1")
        : await tenor.Trending.GIFs("10")

        const random = Math.floor(Math.random() * result.length)
        tenorEmbed
        .setAuthor("tenor", "https://tenor.com/assets/img/tenor-app-icon.png")
        .setTitle(`**Tenor Gif** ${discord.getEmoji("raphi")}`)
        .setURL(result[random].itemurl)
        .setDescription(
            `${discord.getEmoji("star")}_Title:_ **${result[random].title}**\n` +
            `${discord.getEmoji("star")}_Creation Date:_ **${Functions.formatDate(result[random].created)}**`
        )
        .setImage(result[random].media[0].gif.url)
        message.channel.send(tenorEmbed)

    }
}
