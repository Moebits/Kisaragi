import axios from "axios"
import {Message, MessageEmbed} from "discord.js"
import osmosis from "osmosis"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"

export default class Hentaigasm extends Command {
    private readonly headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Search for hentai on hentaigasm.",
            help:
            `
            \`hentaigasm\` - Gets the front page results.
            \`hentaigasm query\` - Gets hentai from the query.
            `,
            examples:
            `
            \`=>hentaigasm love 2 quad\`
            `,
            aliases: [],
            cooldown: 20,
            nsfw: true
        })
    }

    public getComments = async (url: string) => {
        const data = [] as any[]
        let i = 1
        let done = false
        while (!done) {
            await new Promise((resolve) => {
                osmosis.get(url).headers(this.headers)
                .find("ul.comment-list")
                .set({author: `li:nth-child(${i}) > div > div > div.comment-meta > b > span > cite`, text: `li:nth-child(${i}) > div > div > div.comment-content > p`})
                .data(function(d) {
                    if (data.length === 5 || !d.author || !d.text) {
                        done = true
                    } else {
                        const obj = {} as any
                        obj.author = d.author
                        obj.text = d.text
                        data.push(obj)
                    }
                    resolve()
                })
            })
            i++
        }

        return data
    }

    public getStats = async (url: string) => {
        let views = ""
        let comments = ""
        let likes = ""
        await new Promise((resolve) => {
            osmosis.get(url).headers(this.headers)
            .find("div#sidebar > div")
            .set({views: "span.views > i.count", comments: "span.comments > i.count", likes: "span['dp-post-likes likes'] > i.count"})
            .data(function(d) {
                views = d.views
                comments = d.comments
                likes = d.likes
                resolve()
            })
        })
        return {views, comments, likes}
    }

    public getLinks = async (query?: string) => {
        let url =  `http://hentaigasm.com/?orderby=date`
        if (query) url = `http://hentaigasm.com/?s=${query?.replace(/ +/g, "+")}`
        const data = [] as any[]
        await new Promise((resolve) => {
            osmosis.get(url).headers(this.headers)
            .find("div.thumb > a")
            .set({url: "@href", thumb: "span > img > @src"})
            .data(function(d) {
                const obj = {} as any
                obj.url = d.url
                obj.thumb = d.thumb
                data.push(obj)
                resolve()
            })
        })
        return data
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        if (!perms.checkNSFW()) return
        const query = Functions.combineArgs(args, 1).trim()
        const data = await this.getLinks(query)
        const gasmArray: MessageEmbed[] = []
        const max = data.length > 10 ? 10 : data.length
        for (let i = 0; i < max; i++) {
            const html = await axios.get(data[i].url, {headers: this.headers}).then((r) => r.data)
            const download = html.match(/(?<=<a href=")(.*?)(?=" download)/gm)?.[0]
            if (!download) continue
            // const genres = Functions.cleanHTML(html.match(/(?<=<h4>Genres: )((.|\n)*?)(?=<\/div>)/gm)?.[0]).split(",")
            const title = html.match(/(?<=<title>)((.|\n)*?)(?=<\/title>)/gm)?.[0]?.replace("| Hentaigasm - Stream Hentai", "").trim()
            // const date = html.match(/(?<=<h4>)((.|\n)*?)(?=<h4>Hentai)/gim)?.[0].trim()
            const hentaiLink = html.match(/(?<=<h4>Hentai: <a href=")((.|\n)*?)(?=")/gm)?.[0]
            const hentaiName = html.match(/(?<=rel="category tag">)((.|\n)*?)(?=<\/a>)/gm)?.[0]
            // const {views, comments, likes} = await this.getStats(data[i].url)
            const pageComments = await this.getComments(data[i].url)
            let commentDesc = `${discord.getEmoji("star")}_Comments:_\n`
            for (let i = 0; i < pageComments.length; i++) {
                commentDesc += `**${pageComments[i].author}** - ${pageComments[i].text}\n`
            }
            const gasmEmbed = embeds.createEmbed()
            .setAuthor("hentaigasm", "https://i.imgur.com/oZaLumQ.png", "http://hentaigasm.com/")
            .setTitle(`**Hentaigasm Search** ${discord.getEmoji("tohruSmug")}`)
            .setURL(encodeURI(data[i].url))
            .setImage(encodeURI(data[i].thumb))
            .setDescription(
                `${discord.getEmoji("star")}_Hentai:_ [**${title}**](${encodeURI(data[i].url)})\n` +
                // `${discord.getEmoji("star")}_Date:_ **${date}**\n` +
                // `${discord.getEmoji("star")}_Genres:_ **${genres.join(", ")}**\n` +
                // `${discord.getEmoji("star")}_Views:_ **${views}**\n` +
                // `${discord.getEmoji("star")}_Comments:_ **${comments}**\n` +
                // `${discord.getEmoji("star")}_Likes:_ **${likes}**\n` +
                `${discord.getEmoji("star")}_Page:_ [**${hentaiName}**](${hentaiLink})\n` +
                `${discord.getEmoji("star")}_Link:_ [**Direct Link**](${encodeURI(download)})\n` +
                Functions.checkChar(commentDesc, 1000, "\n")
            )
            gasmArray.push(gasmEmbed)
        }
        if (gasmArray.length === 1) {
            await message.channel.send(gasmArray[0])
        } else {
            embeds.createReactionEmbed(gasmArray, true, true)
        }
        return
    }
}
