import {Message, MessageEmbed} from "discord.js"
import osmosis from "osmosis"
import {Command} from "../../structures/Command"
import {CommandFunctions} from "./../../structures/CommandFunctions"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Crunchyroll extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches for an anime on crunchyroll.",
            help:
            `
            \`crunchyroll url/query\` - Searches crunchyroll for the url/query.
            \`crunchyroll download/dl dub/mp3/subs? url/query\` - Downloads an anime episode. This is an alias, see \`crunchydl\`.
            `,
            examples:
            `
            \`=>crunchyroll kiniro mosaic\`
            \`=>crunchyroll konosuba\`
            \`=>crunchyroll download mp3 is the order a rabbit 3\`
            `,
            aliases: ["cr", "crunchy"],
            random: "string",
            cooldown: 10
        })
    }

    public getEmbed = async (link: string) => {
        const discord = this.discord
        const embeds = new Embeds(discord, this.message)
        const data = await this.getLinkData(link)
        const episodes = await this.getEpisodeNames(link)
        const title = Functions.toProperCase(link.replace("https://www.crunchyroll.com/", "").replace(/-/g, " "))
        const eps = episodes.join("\n")
        const crunchyEmbed = embeds.createEmbed()
        crunchyEmbed
        .setAuthor("crunchyroll", "https://www.groovypost.com/wp-content/uploads/2013/06/Crunchyroll-Apple-TV.png", "https://www.crunchyroll.com/")
        .setTitle(`**Crunchyroll Search** ${discord.getEmoji("himeHappy")}`)
        .setImage(data.image)
        .setURL(link)
        .setDescription(
            `${discord.getEmoji("star")}_Anime:_ **${title}**\n` +
            `${discord.getEmoji("star")}_Publisher:_ **${data.publisher}**\n` +
            `${discord.getEmoji("star")}_Rating:_ **${data.rating}**\n` +
            `${discord.getEmoji("star")}_Description:_ ${Functions.checkChar(data.desc, 1300, " ")}\n` +
            `${discord.getEmoji("star")}_Episodes:_ ${Functions.checkChar(eps, 500, "\n")}\n`
        )
        return crunchyEmbed
    }

    public getEpisodeNames = async (link: string) => {
        const data: any[] = []
        let i = 1
        let done = false
        while (!done) {
            await new Promise((resolve) => {
                osmosis.get(link)
                .find("div#source_showview")
                .set({episode: `div > div > div > div > ul > li > ul > li:nth(${i}) > div > a > img > @alt`, num: `div > div > div > div > ul > li > ul > li:nth(${i}) > div > a > span`})
                .data(function(d) {
                    if (d.episode && !data.includes(d.episode)) {
                        const ep = d.episode + ` (${d.num.match(/\d+/) ? d.num.match(/\d+/)[0] : "?"})`
                        data.push(ep)
                    } else {
                        done = true
                    }
                    resolve()
                })
            })
            i++
        }
        return data
    }

    public getLinkData = async (link: string) => {
        let data: any = ""
        await new Promise((resolve) => {
            osmosis.get(link)
            .find("div#source_showview")
            .set({image: "div > div > ul > li > img > @src", desc: "div > div > ul > li > p > span.more", rating: "div > div > ul > li > div > div > span > span > @content",
                  publisher: "div > div > ul > li > ul > li > a"})
            .data(function(d) {
                data = d
                resolve()
            })

        })
        return data
    }

    public getSearchLinks = async (query: string) => {
        const links: string[] = []
        let done = false
        let i = 1
        while (!done) {
            await new Promise((resolve) => {
                osmosis.get(`https://www.crunchyroll.com/search?from=search&q=${query}`)
                .find("ul.search-results")
                .set({url: `li:nth-child(${i}) > a > @href`})
                .data(function(d) {
                    if (d.url && !d.url.match(/\/library/)) {
                        d.url = "https://www.crunchyroll.com" + d.url
                        links.push(d.url)
                        done = true
                    }
                    resolve()
                })
            })
            i++
        }
        return links
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const cmd = new CommandFunctions(discord, message)
        const query = Functions.combineArgs(args, 1).trim()

        if (args[1] === "download" || args[1] === "dl") {
            return cmd.runCommand(message, ["crunchydl", ...Functions.combineArgs(args, 2).split(" ")])
        }

        if (!query) {
            return this.noQuery(embeds.createEmbed())
        }

        if (query.match(/crunchyroll.com/)) {
            const crunchyEmbed = await this.getEmbed(query)
            return message.channel.send(crunchyEmbed)
        }

        const links = await Functions.promiseTimeout(30000, this.getSearchLinks(query)).catch(() => {
            return this.invalidQuery(embeds.createEmbed()
            .setAuthor("crunchyroll", "https://www.groovypost.com/wp-content/uploads/2013/06/Crunchyroll-Apple-TV.png", "https://www.crunchyroll.com/")
            .setTitle(`**Crunchyroll Search** ${discord.getEmoji("himeHappy")}`))
        }) as any
        if (!links || !links[0]) {
            return this.invalidQuery(embeds.createEmbed()
            .setAuthor("crunchyroll", "https://www.groovypost.com/wp-content/uploads/2013/06/Crunchyroll-Apple-TV.png", "https://www.crunchyroll.com/")
            .setTitle(`**Crunchyroll Search** ${discord.getEmoji("himeHappy")}`))
        }
        const crunchyEmbed = await this.getEmbed(links[0])
        message.channel.send(crunchyEmbed)
        return
    }
}
