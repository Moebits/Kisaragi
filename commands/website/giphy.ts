import type {Message, MessageEmbed} from "discord.js"
import Giphy, {MultiResponse} from "giphy-api"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class GiphyCommand extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches for a gif on giphy.",
            help:
            `
            \`giphy\` - Gets a random gif
            \`giphy query\` - Searches giphy for the query.
            `,
            examples:
            `
            \`=>giphy\`
            \`=>giphy anime\`
            `,
            aliases: ["gif"],
            random: "none",
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const giphy = Giphy(process.env.GIPHY_API_KEY)
        const query = Functions.combineArgs(args, 1)
        let gif
        if (query) {
            if (query.match(/giphy.com/)) {
                const id = query.match(/-(?:.(?!-))+$/)?.[0].replace(/-/g, "")
                gif = await giphy.id(id!).then((r: MultiResponse) => r.data)
            } else {
                const result = await giphy.random(query)
                gif = [result.data]
            }
        } else {
            const result = await giphy.trending()
            gif = result.data
        }
        const giphyArray: MessageEmbed[] = []
        for (let i = 0; i < gif.length; i++) {
            const giphyEmbed = embeds.createEmbed()
            giphyEmbed
            .setAuthor("giphy", "https://media0.giphy.com/media/YJBNjrvG5Ctmo/giphy.gif")
            .setTitle(`**Giphy Gif** ${discord.getEmoji("raphi")}`)
            .setURL(gif[i].url)
            .setDescription(
                `${discord.getEmoji("star")}_Title:_ **${gif[i].title}**\n` +
                `${discord.getEmoji("star")}_Creation Date:_ **${Functions.formatDate(new Date(gif[i].import_datetime))}**\n` +
                `${discord.getEmoji("star")}_Source Post:_ ${gif[i].source_post_url ? gif[i].source_post_url : "None"}\n`
            )
            .setImage(gif[i]?.images?.original?.url ?? "")
            giphyArray.push(giphyEmbed)
        }

        if (giphyArray.length === 1) {
            message.channel.send(giphyArray[0])
        } else {
            embeds.createReactionEmbed(giphyArray, true, true)
        }
        return
    }
}
