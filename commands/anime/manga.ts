import {Message} from "discord.js"
import * as weeb from "node-weeb"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Manga extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const query = Functions.combineArgs(args, 1)
        const mangaEmbed = embeds.createEmbed()

        if (!query) {
            mangaEmbed
            .setAuthor("kitsu", "https://avatars0.githubusercontent.com/u/7648832?s=280&v=4")
            .setTitle(`**Manga** ${discord.getEmoji("gabYes")}`)
            .setDescription("You must provide a manga to search!")
            message.channel.send(mangaEmbed)
            return
        }

        const result = await weeb.manga(query)
        const data = JSON.parse(result).data[0]
        mangaEmbed
        .setAuthor("kitsu", "https://avatars0.githubusercontent.com/u/7648832?s=280&v=4")
        .setURL(`https://kitsu.io/manga/${data.attributes.slug}`)
        .setTitle(`${data.attributes.titles.en} ${discord.getEmoji("gabYes")}`)
        .setDescription(
            `${discord.getEmoji("star")}_Japanese Title:_ **${data.attributes.titles.ja_jp}**\n` +
            `${discord.getEmoji("star")}_Most Popular Rank:_ **#${data.attributes.popularityRank}**\n` +
            `${discord.getEmoji("star")}_Community Approval:_ **${data.attributes.averageRating}%**\n` +
            `${discord.getEmoji("star")}_Highly Rated Rank:_ **#${data.attributes.ratingRank}**\n` +
            `${discord.getEmoji("star")}_Chapters:_ **${data.attributes.chapterCount ? data.attributes.chapterCount : "Ongoing"}** _Volumes:_ **${data.attributes.volumeCount}**\n` +
            `${discord.getEmoji("star")}_User Count:_ **${data.attributes.userCount}**\n` +
            `${discord.getEmoji("star")}_Favorites:_ **${data.attributes.favoritesCount}**\n` +
            `${discord.getEmoji("star")}_Published:_ **${Functions.formatDate(data.attributes.startDate)} to ${Functions.formatDate(data.attributes.endDate)}**\n` +
            `${discord.getEmoji("star")}_Trailer:_ https://www.youtube.com/watch?v=${data.attributes.youtubeVideoId}\n` +
            `${discord.getEmoji("star")}_Age Rating:_ **${data.attributes.ageRatingGuide}**\n` +
            `${discord.getEmoji("star")}_Serialization:_ **${data.attributes.serialization}**\n` +
            `${discord.getEmoji("star")}_Synopsis:_ ${Functions.checkChar(data.attributes.synopsis, 2000, ".")}\n`
        )
        .setImage(data.attributes.coverImage ? data.attributes.coverImage.original : data.attributes.posterImage.original)
        .setThumbnail(data.attributes.posterImage.original)
        message.channel.send(mangaEmbed)
    }
}
