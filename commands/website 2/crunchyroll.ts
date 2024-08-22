// import crunchyroll, {CrunchyrollSeason} from "crunchyroll.ts"
import {Message, EmbedBuilder} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {CommandFunctions} from "./../../structures/CommandFunctions"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Crunchyroll extends Command {
    private readonly headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches for an anime on crunchyroll.",
            help:
            `
            \`crunchyroll url/query\` - Searches crunchyroll for the url/query.
            \`crunchyroll download/dl url/query\` - This is an alias for the command \`crunchydl\`.
            `,
            examples:
            `
            \`=>crunchyroll kiniro mosaic\`
            \`=>crunchyroll konosuba\`
            \`=>crunchyroll download is the order a rabbit 3\`
            `,
            aliases: ["cr", "crunchy"],
            random: "string",
            cooldown: 10
        })
    }

    public getEmbed = async (season: CrunchyrollSeason) => {
        const discord = this.discord
        const embeds = new Embeds(discord, this.message)
        const anime = await crunchyroll.anime.get(season)
        const episodes = await crunchyroll.anime.episodes(season).then((e) => e.map((e) => e.name))
        const eps = episodes.join("\n")
        const crunchyEmbed = embeds.createEmbed()
        crunchyEmbed
        .setAuthor({name: "crunchyroll", iconURL: "https://www.groovypost.com/wp-content/uploads/2013/06/Crunchyroll-Apple-TV.png", url: "https://www.crunchyroll.com/"})
        .setTitle(`**Crunchyroll Search** ${discord.getEmoji("himeHappy")}`)
        .setImage(season.portrait_image?.full_url ?? anime.portrait_image?.full_url)
        .setThumbnail(season.landscape_image?.full_url ?? anime.portrait_image?.full_url)
        .setURL(anime.url)
        .setDescription(
            `${discord.getEmoji("star")}_Anime:_ **${season.name}**\n` +
            `${discord.getEmoji("star")}_Publisher:_ **${anime.publisher_name}**\n` +
            `${discord.getEmoji("star")}_Rating:_ **${anime.rating}**\n` +
            `${discord.getEmoji("star")}_Description:_ ${Functions.checkChar(season.description, 1300, " ")}\n` +
            `${discord.getEmoji("star")}_Episodes:_ ${Functions.checkChar(eps, 500, "\n")}\n`
        )
        return crunchyEmbed
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const cmd = new CommandFunctions(discord, message)
        const perms = new Permission(discord, message)
        if (discord.checkMuted(message)) if (!perms.checkNSFW()) return
        const query = Functions.combineArgs(args, 1).trim()

        if (args[1] === "download" || args[1] === "dl") {
            return cmd.runCommand(message, ["crunchydl", ...Functions.combineArgs(args, 2).split(" ")])
        }

        if (!query) {
            return this.noQuery(embeds.createEmbed())
        }

        const seasons = await crunchyroll.season.search(query).catch(() => {
            return this.invalidQuery(embeds.createEmbed()
            .setAuthor({name: "crunchyroll", iconURL: "https://www.groovypost.com/wp-content/uploads/2013/06/Crunchyroll-Apple-TV.png", url: "https://www.crunchyroll.com/"})
            .setTitle(`**Crunchyroll Search** ${discord.getEmoji("himeHappy")}`))
        }) as CrunchyrollSeason[]

        const crunchyArray: EmbedBuilder[] = []
        for (let i = 0; i < seasons.length; i++) {
            const crunchyEmbed = await this.getEmbed(seasons[i])
            crunchyArray.push(crunchyEmbed)
        }
        embeds.createReactionEmbed(crunchyArray, false, true)
        return
    }
}
