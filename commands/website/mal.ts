import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

const Jikan = require("jikan-node")

export default class Mal extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const mal = new Jikan()

        if (args[1] === "character") {
            const query = Functions.combineArgs(args, 2)
            const result = await mal.search("character", query.trim())
            const malArray: MessageEmbed[] = []
            for (let i = 0; i < result.results.length; i++) {
                const char = result.results[i]
                const detailed = await mal.findCharacter(char.mal_id)
                const info = char.anime.join("") ? char.anime.map((n: any) => n.name) : char.manga.map((n: any) => n.name)
                const malEmbed = embeds.createEmbed()
                malEmbed
                .setAuthor("my anime list", "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png")
                .setTitle(`**My Anime List Search** ${discord.getEmoji("raphi")}`)
                .setURL(char.url)
                .setImage(char.image_url)
                .setThumbnail("https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png")
                .setDescription(
                    `${discord.getEmoji("star")}_Character:_ **${char.name}**\n` +
                    `${discord.getEmoji("star")}_Kanji:_ **${detailed.name_kanji ? detailed.name_kanji : "None"}**\n` +
                    `${discord.getEmoji("star")}_Alternate Names:_ **${char.alternate_names ? char.alternate_names.join(", ") : "None"}**\n` +
                    `${discord.getEmoji("star")}_Series:_ ${info.join(", ")}\n` +
                    `${discord.getEmoji("star")}_Favorites:_ **${detailed.member_favorites}**\n` +
                    `${discord.getEmoji("star")}_Description:_ ${detailed.about}\n`
                )
                malArray.push(malEmbed)
            }
            embeds.createReactionEmbed(malArray)
            return
        }

        if (args[1] === "user") {
            const result = await mal.findUser(args[2])
            const malEmbed = embeds.createEmbed()
            const anime = result.favorites.anime.map((a: any) => a.name)
            const characters = result.favorites.characters.map((c: any) => c.name)
            const cleanText = result.about.replace(/<\/?[^>]+(>|$)/g, "")
            malEmbed
            .setAuthor("my anime list", "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png")
            .setTitle(`**My Anime List Search** ${discord.getEmoji("raphi")}`)
            .setURL(result.url)
            .setImage(result.image_url)
            .setThumbnail("https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png")
            .setDescription(
                `${discord.getEmoji("star")}_User:_ **${result.username}**\n` +
                `${discord.getEmoji("star")}_Last Online:_ **${Functions.formatDate(result.last_online)}**\n` +
                `${discord.getEmoji("star")}_Join Date:_ **${Functions.formatDate(result.joined)}**\n` +
                `${discord.getEmoji("star")}_Birthday:_ **${Functions.formatDate(result.birthday)}**\n` +
                `${discord.getEmoji("star")}_Location:_ **${result.location}**\n` +
                `${discord.getEmoji("star")}_Days Watched:_ **${result.anime_stats.days_watched}**\n` +
                `${discord.getEmoji("star")}_Episodes Watched:_ **${result.anime_stats.episodes_watched}**\n` +
                `${discord.getEmoji("star")}_Entries:_ **${result.anime_stats.total_entries}**\n` +
                `${discord.getEmoji("star")}_Favorite Anime:_ ${Functions.checkChar(anime.join(", "), 100, " ")}\n` +
                `${discord.getEmoji("star")}_Favorite Characters:_ ${Functions.checkChar(characters.join(", "), 100, " ")}\n` +
                `${discord.getEmoji("star")}_Description:_ ${Functions.checkChar(cleanText, 1500, " ")}\n`
            )
            message.channel.send(malEmbed)
            return

        }

        let result
        const query = Functions.combineArgs(args, 1)
        if (!query) {
            const raw = await mal.findTop("anime")
            result = raw.top
        } else {
            const raw = await mal.search("anime", query.trim())
            result = raw.results
        }

        const malArray: any = []
        for (let i = 0; i < result.length; i++) {
            const malEmbed = embeds.createEmbed()
            const anime = result[i]
            const detailed = await mal.findAnime(anime.mal_id)
            malEmbed
            .setAuthor("my anime list", "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png")
            .setTitle(`**My Anime List Search** ${discord.getEmoji("raphi")}`)
            .setURL(anime.url)
            .setImage(anime.image_url)
            .setThumbnail("https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png")
            .setDescription(
                `${discord.getEmoji("star")}_Anime:_ **${anime.title}**\n` +
                `${discord.getEmoji("star")}_Episodes:_ **${anime.episodes}**\n` +
                `${discord.getEmoji("star")}_Start Date:_ **${Functions.formatDate(anime.start_date)}**\n` +
                `${discord.getEmoji("star")}_End Date:_ **${Functions.formatDate(anime.end_date)}**\n` +
                `${discord.getEmoji("star")}_Members:_ **${anime.members}**\n` +
                `${discord.getEmoji("star")}_Score:_ **${anime.score}**\n` +
                `${discord.getEmoji("star")}_Rank:_ **${detailed.rank}**\n` +
                `${discord.getEmoji("star")}_Popularity:_ **${detailed.popularity}**\n` +
                `${discord.getEmoji("star")}_Description:_ ${Functions.checkChar(detailed.synopsis, 1700, ".")}\n`
            )
            malArray.push(malEmbed)
        }
        embeds.createReactionEmbed(malArray)
    }
}
