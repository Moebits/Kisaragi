import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

const Tenor = require("tenorjs")

export default class TenorCommand extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches for gifs on tenor.",
            help:
            `
            \`tenor\` - Posts a random gif
            \`tenor query\` - Searches for a gif with the query
            \`tenor url\` - Gets the gif from the url
            `,
            examples:
            `
            \`=>tenor\`
            \`=>tenor anime\`
            `,
            aliases: ["ten"],
            random: "none",
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const tenor = new Tenor.client({
            Key: process.env.TENOR_API_KEY,
            Filter: "off",
            Locale: "en_US",
            MediaFilter: "minimal",
            DateFormat: "MM/DD/YYYY"
        })

        const query = Functions.combineArgs(args, 1)
        let result
        if (query) {
            if (query.match(/tenor.com/)) {
                const id = query.match(/(?<=-)(?:.(?!-))+$/)
                result = tenor.Search.Find([id])
            } else {
                result = await tenor.Search.Query(query, "1")
            }
        } else {
            result = await tenor.Trending.GIFs("10")
        }
        const tenorArray: MessageEmbed[] = []
        for (let i = 0; i < result.length; i++) {
            const tenorEmbed = embeds.createEmbed()
            tenorEmbed
            .setAuthor("tenor", "https://tenor.com/assets/img/tenor-app-icon.png")
            .setTitle(`**Tenor Gif** ${discord.getEmoji("raphi")}`)
            .setURL(result[i].itemurl)
            .setDescription(
                `${discord.getEmoji("star")}_Title:_ **${result[i].title}**\n` +
                `${discord.getEmoji("star")}_Creation Date:_ **${Functions.formatDate(result[i].created)}**`
            )
            .setImage(result[i].media[0].gif.url)
            tenorArray.push(tenorEmbed)
        }

        if (tenorArray.length === 1) {
            message.channel.send(tenorArray[0])
        } else {
            embeds.createReactionEmbed(tenorArray, true, true)
        }
        return
    }
}
