import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

const weeb = require("node-weeb")

export default class Anime extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches for an anime series.",
            help:
            `
            \`anime query\` - Searches kitsu for the given query.
            `,
            examples:
            `
            \`=>anime gabriel dropout\`
            \`=>anime konosuba\`
            \`=>anime rezero\`
            `,
            aliases: ["a"],
            cooldown: 30,
            image: "../assets/help images/anime/anime.png"
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const query = Functions.combineArgs(args, 1)
        const star = discord.getEmoji("star")
        const animeEmbed = embeds.createEmbed()
        .setAuthor("kitsu", "https://avatars0.githubusercontent.com/u/7648832?s=280&v=4")
        .setTitle(`**Anime Search** ${discord.getEmoji("gabYes")}`)

        if (!query) {
            return this.noQuery(animeEmbed,
            `This has to be the name of an anime series. If you are unsure, ` +
            `try searching on the [**Kitsu Website**](https://kitsu.io/anime)`)
        }

        const result = await weeb.anime(query)
        const data = JSON.parse(result).data[0]
        if (!data) {
            return this.invalidQuery(animeEmbed, "You can try searching on the [**Kitsu Website**](https://kitsu.io/anime)")
        }
        animeEmbed
        .setAuthor("kitsu", "https://avatars0.githubusercontent.com/u/7648832?s=280&v=4")
        .setURL(`https://kitsu.io/anime/${data.attributes.slug}`)
        .setTitle(`**${data.attributes.titles.en_jp}** ${discord.getEmoji("gabYes")}`)
        .setDescription(
            `${star}_Japanese Title:_ **${data.attributes.titles.ja_jp}**\n` +
            `${star}_Most Popular Rank:_ **#${data.attributes.popularityRank}**\n` +
            `${star}_Community Approval:_ **${data.attributes.averageRating}%**\n` +
            `${star}_Highly Rated Rank:_ **#${data.attributes.ratingRank}**\n` +
            `${star}_Episodes:_ **${data.attributes.episodeCount ? data.attributes.episodeCount : "Still Airing"}** _Length:_ **${data.attributes.totalLength}m (${data.attributes.episodeLength}m each)**\n` +
            `${star}_User Count:_ **${data.attributes.userCount}**\n` +
            `${star}_Aired:_ **${Functions.formatDate(data.attributes.startDate)} to ${Functions.formatDate(data.attributes.endDate)}**\n` +
            `${star}_Age Rating:_ **${data.attributes.ageRatingGuide}**\n` +
            `${star}_Synopsis:_ ${Functions.checkChar(data.attributes.synopsis, 2000, ".")}\n`
        )
        .setImage(data.attributes.coverImage ? data.attributes.coverImage.original : data.attributes.posterImage.original)
        .setThumbnail(data.attributes.posterImage.original)
        message.channel.send(animeEmbed)
    }
}
