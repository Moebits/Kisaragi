import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

const weeb = require("node-weeb")

export default class Anime extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const query = Functions.combineArgs(args, 1)
        const animeEmbed = embeds.createEmbed()

        if (!query) {
            animeEmbed
            .setAuthor("kitsu", "https://avatars0.githubusercontent.com/u/7648832?s=280&v=4")
            .setTitle(`**Anime** ${discord.getEmoji("gabYes")}`)
            .setDescription("You must provide an anime to search!")
            message.channel.send(animeEmbed)
            return
        }

        const result = await weeb.anime(query)
        const data = JSON.parse(result).data[0]
        animeEmbed
        .setAuthor("kitsu", "https://avatars0.githubusercontent.com/u/7648832?s=280&v=4")
        .setURL(`https://kitsu.io/anime/${data.attributes.slug}`)
        .setTitle(`${data.attributes.titles.en} ${discord.getEmoji("gabYes")}`)
        .setDescription(
            `${discord.getEmoji("star")}_Japanese Title:_ **${data.attributes.titles.ja_jp}**\n` +
            `${discord.getEmoji("star")}_Most Popular Rank:_ **#${data.attributes.popularityRank}**\n` +
            `${discord.getEmoji("star")}_Community Approval:_ **${data.attributes.averageRating}%**\n` +
            `${discord.getEmoji("star")}_Highly Rated Rank:_ **#${data.attributes.ratingRank}**\n` +
            `${discord.getEmoji("star")}_Episodes:_ **${data.attributes.episodeCount ? data.attributes.episodeCount : "Still Airing"}** _Length:_ **${data.attributes.totalLength}m (${data.attributes.episodeLength}m each)**\n` +
            `${discord.getEmoji("star")}_User Count:_ **${data.attributes.userCount}**\n` +
            `${discord.getEmoji("star")}_Aired:_ **${Functions.formatDate(data.attributes.startDate)} to ${Functions.formatDate(data.attributes.endDate)}**\n` +
            `${discord.getEmoji("star")}_Age Rating:_ **${data.attributes.ageRatingGuide}**\n` +
            `${discord.getEmoji("star")}_Synopsis:_ ${Functions.checkChar(data.attributes.synopsis, 2000, ".")}\n`
        )
        .setImage(data.attributes.coverImage ? data.attributes.coverImage.original : data.attributes.posterImage.original)
        .setThumbnail(data.attributes.posterImage.original)
        message.channel.send(animeEmbed)
    }
}
