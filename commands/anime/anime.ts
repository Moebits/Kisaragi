import {Message, SlashCommandBuilder, SlashCommandStringOption} from "discord.js"
import {SlashCommandOption} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

const weeb = require("node-weeb")

export default class Anime extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Searches for an anime series.",
            help:
            `
            \`anime query\` - Searches for an anime with the query.
            `,
            examples:
            `
            \`=>anime gabriel dropout\`
            \`=>anime konosuba\`
            \`=>anime rezero\`
            `,
            aliases: ["a"],
            random: "string",
            cooldown: 10,
            slashEnabled: true
        })
        const queryOption = new SlashCommandStringOption()
            .setName("query")
            .setDescription("The query to search for.")
            .setRequired(true)

        this.slash = new SlashCommandBuilder()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addStringOption(queryOption)
            .toJSON()
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        if (discord.checkMuted(message)) if (!perms.checkNSFW()) return
        let query = Functions.combineArgs(args, 1)
        const animeEmbed = embeds.createEmbed()
        .setAuthor({name: "kitsu", iconURL: "https://avatars0.githubusercontent.com/u/7648832?s=280&v=4"})
        .setTitle(`**Anime** ${discord.getEmoji("gabYes")}`)

        if (!query) {
            return this.noQuery(animeEmbed,
            `This has to be the name of an anime series. If you are unsure, ` +
            `try searching on the [**Kitsu Website**](https://kitsu.io/anime)`)
        }

        if (query.match(/kitsu.io/)) {
            query = query.replace("https://kitsu.io/anime/", "").replace(/-/g, " ")
        }

        const result = await weeb.anime(query)
        const data = JSON.parse(result).data[0]
        if (!data) {
            return this.invalidQuery(animeEmbed, "You can try searching on the [**Kitsu Website**](https://kitsu.io/anime)")
        }
        animeEmbed
        .setAuthor({name: "kitsu", iconURL: "https://avatars0.githubusercontent.com/u/7648832?s=280&v=4"})
        .setURL(`https://kitsu.io/anime/${data.attributes.slug}`)
        .setTitle(`**${data.attributes.titles.en_jp}** ${discord.getEmoji("gabYes")}`)
        .setDescription(
            `${discord.getEmoji("star")}_Japanese Title:_ **${data.attributes.titles.ja_jp}**\n` +
            `${discord.getEmoji("star")}_Popularity Rank:_ **#${data.attributes.popularityRank}**\n` +
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
        message.channel.send({embeds: [animeEmbed]})
    }
}
