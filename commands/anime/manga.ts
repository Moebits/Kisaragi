import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

const weeb = require("node-weeb")

export default class Manga extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Search for a manga series.",
            help:
            `
            \`manga query\` - Searches for a manga with the query.
            `,
            examples:
            `
            \`=>manga gabriel dropout\`
            \`=>manga sword art online\`
            \`=>manga himouto umaru chan\`
            `,
            aliases: ["m"],
            cooldown: 10,
            image: "../assets/help images/anime/manga.png"
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const star = discord.getEmoji("star")
        const query = Functions.combineArgs(args, 1)
        const mangaEmbed = embeds.createEmbed()
        .setAuthor("kitsu", "https://avatars0.githubusercontent.com/u/7648832?s=280&v=4")
        .setTitle(`**Manga** ${discord.getEmoji("gabYes")}`)

        if (!query) {
            return this.noQuery(mangaEmbed,
            `This has to be the name of a manga series. If you are unsure, ` +
            `try searching on the [**Kitsu Website**](https://kitsu.io/anime)`)
        }

        const result = await weeb.manga(query)
        const data = JSON.parse(result).data[0]
        if (!data) {
            return this.invalidQuery(mangaEmbed, "You can try searching on the [**Kitsu Website**](https://kitsu.io/anime)")
        }
        mangaEmbed
        .setURL(`https://kitsu.io/manga/${data.attributes.slug}`)
        .setTitle(`${data.attributes.titles.en_jp} ${discord.getEmoji("gabYes")}`)
        .setDescription(
            `${star}_Japanese Title:_ **${data.attributes.titles.ja_jp}**\n` +
            `${star}_Most Popular Rank:_ **#${data.attributes.popularityRank}**\n` +
            `${star}_Community Approval:_ **${data.attributes.averageRating}%**\n` +
            `${star}_Highly Rated Rank:_ **#${data.attributes.ratingRank}**\n` +
            `${star}_Chapters:_ **${data.attributes.chapterCount ? data.attributes.chapterCount : "Ongoing"}** _Volumes:_ **${data.attributes.volumeCount}**\n` +
            `${star}_User Count:_ **${data.attributes.userCount}**\n` +
            `${star}_Favorites:_ **${data.attributes.favoritesCount}**\n` +
            `${star}_Published:_ **${Functions.formatDate(data.attributes.startDate)} to ${Functions.formatDate(data.attributes.endDate)}**\n` +
            `${star}_Trailer:_ https://www.youtube.com/watch?v=${data.attributes.youtubeVideoId}\n` +
            `${star}_Age Rating:_ **${data.attributes.ageRatingGuide}**\n` +
            `${star}_Serialization:_ **${data.attributes.serialization}**\n` +
            `${star}_Synopsis:_ ${Functions.checkChar(data.attributes.synopsis, 2000, ".")}\n`
        )
        .setImage(data.attributes.coverImage ? data.attributes.coverImage.original : data.attributes.posterImage.original)
        .setThumbnail(data.attributes.posterImage.original)
        message.channel.send(mangaEmbed)
    }
}
