import axios from "axios"
import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"

export default class Fiverr extends Command {
    private readonly headers = {
        "authority": "www.fiverr.com",
        "method": "GET",
        "scheme": "https",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "en-US,en;q=0.9",
        "if-none-match": "W/\"1e8930d9e33e15d19f1aea765f958bb5\"",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"
    }
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches for gigs on fiverr.",
            help:
            `
            \`fiverr query\` - Searches for gigs
            `,
            examples:
            `
            \`=>fiverr anime\`
            `,
            aliases: [],
            random: "none",
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        let query = Functions.combineArgs(args, 1).trim()
        if (!query) query = "anime"
        const h = {path: `/search/gigs?query=${query}&source=top-bar&search_in=everywhere&search-autocomplete-original-term=${query}`, referer: "https://www.fiverr.com/?source=top_nav"}
        const searchURL = `https://www.fiverr.com/search/gigs?query=${query}&source=top-bar&search_in=everywhere&search-autocomplete-original-term=${query}`
        const html = await axios.get(searchURL, {headers: {...this.headers, ...h}}).then((r) => r.data)
        const json = JSON.parse(html.match(/({"loggerOptions":)((.|\n)*?)(}}}})/gm)?.[0])
        const gigs = json.listings.gigs
        const max = gigs.length > 10 ? 10 : gigs.length

        const fiverrArray: MessageEmbed[] = []
        for (let i = 0; i < max; i++) {
            const gig = gigs[i]
            const url = `https://www.fiverr.com${gig.gig_url}`
            const h = {path: gig.gig_url, referer: searchURL}
            const html2 = await axios.get(url, {headers: {...this.headers, ...h}}).then((r) => r.data)
            const match = html2.match(/({"loggerOptions":)((.|\n)*?)(?=\);)/gm)?.[0]
            if (!match) continue
            const json2 = JSON.parse(match)
            const country = json2.sellerCard.country
            const specialty = json2.sellerCard.oneLiner
            const sellerDesc = Functions.checkChar(json2.sellerCard.description, 300, " ")
            const desc = Functions.checkChar(Functions.decodeEntities(Functions.cleanHTML(json2.description.content)), 1000, " ")
            const fiverrEmbed = embeds.createEmbed()
            fiverrEmbed
            .setAuthor("fiverr", "https://fiverr-res.cloudinary.com/t_profile_original,q_auto,f_auto/profile/photos/41433645/original/fiverr-logo.png", "https://www.fiverr.com/")
            .setTitle(`**Fiverr Search** ${discord.getEmoji("tohruThink")}`)
            .setURL(url)
            .setThumbnail(gig.seller_img)
            .setImage(gig.assets?.[0]?.cloud_img_main_gig ?? "")
            .setDescription(
                `${discord.getEmoji("star")}_Gig:_ **I will ${gig.title}**\n` +
                `${discord.getEmoji("star")}_Seller:_ [**${gig.seller_name}**](https://www.fiverr.com${gig.seller_url})\n` +
                `${discord.getEmoji("star")}_Country:_ **${country}**\n` +
                `${discord.getEmoji("star")}_Specialty:_ **${specialty}**\n` +
                `${discord.getEmoji("star")}_Reviews:_ **${gig.buying_review_rating_count}**\n` +
                `${discord.getEmoji("star")}_Rating:_ **${gig.buying_review_rating.toFixed(2)}**\n` +
                `${discord.getEmoji("star")}_Price:_ **$${gig.price_i}**\n` +
                `${discord.getEmoji("star")}_Seller Desc:_ ${sellerDesc}\n` +
                `${discord.getEmoji("star")}_About This Gig:_ ${desc}\n`
            )
            fiverrArray.push(fiverrEmbed)
        }
        if (fiverrArray.length === 1) {
            await message.channel.send(fiverrArray[0])
        } else {
            embeds.createReactionEmbed(fiverrArray)
        }
        return
    }
}
