import {Message} from "discord.js"
import Giphy from "giphy-api"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class GiphyCommand extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const giphy = Giphy(process.env.GIPHY_API_KEY)
        const query = Functions.combineArgs(args, 1)
        const giphyEmbed = embeds.createEmbed()
        let gif
        if (query) {
            const result = await giphy.random(query)
            gif = result.data
        } else {
            const result = await giphy.trending()
            const random = Math.floor(Math.random() * result.data.length)
            gif = result.data[random]
        }

        giphyEmbed
        .setAuthor("giphy", "https://media0.giphy.com/media/YJBNjrvG5Ctmo/giphy.gif")
        .setTitle(`**Giphy Gif** ${discord.getEmoji("raphi")}`)
        .setURL(gif.url)
        .setDescription(
            `${discord.getEmoji("star")}_Title:_ **${gif.title}**\n` +
            `${discord.getEmoji("star")}_Creation Date:_ **${Functions.formatDate(new Date(gif.import_datetime))}**\n` +
            `${discord.getEmoji("star")}_Source Post:_ ${gif.source_post_url ? gif.source_post_url : "None"}\n`
        )
        .setImage(gif.images.original.url)
        message.channel.send(giphyEmbed)
    }
}
