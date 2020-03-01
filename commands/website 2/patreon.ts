import axios from "axios"
import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Patreon extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches for a patreon creator.",
            help:
            `
            \`patreon creator\` - Searches for the creator page of the creator.
            `,
            examples:
            `
            \`=>patreon synthion\`
            `,
            aliases: [],
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const star = discord.getEmoji("star")

        const query = Functions.combineArgs(args, 1).trim()
        if (!query) {
            return this.noQuery(embeds.createEmbed()
            .setAuthor("patreon", "https://cdn.vox-cdn.com/thumbor/FkSiWSfqhyDOYUn05rHCljZPBwY=/0x0:1071x1047/1400x933/filters:focal(376x385:546x555):no_upscale()/cdn.vox-cdn.com/uploads/chorus_image/image/57898065/patreon.1512686514.jpg")
            .setTitle(`**Patreon Search** ${discord.getEmoji("raphi")}`), "You must provide a creator name.")
        }
        const response = await axios.get(`https://www.patreon.com/${query}`)
        if (!response.data.match(/(?<="related": "https:\/\/www.patreon.com\/api\/campaigns\/)(.*?)(?=")/)) {
            return this.invalidQuery(embeds.createEmbed()
            .setAuthor("patreon", "https://cdn.vox-cdn.com/thumbor/FkSiWSfqhyDOYUn05rHCljZPBwY=/0x0:1071x1047/1400x933/filters:focal(376x385:546x555):no_upscale()/cdn.vox-cdn.com/uploads/chorus_image/image/57898065/patreon.1512686514.jpg")
            .setTitle(`**Patreon Search** ${discord.getEmoji("raphi")}`))
        }
        const id = response.data.match(/(?<="related": "https:\/\/www.patreon.com\/api\/campaigns\/)(.*?)(?=")/)[0]
        const json = await axios.get(`https://www.patreon.com/api/campaigns/${id}`)
        const details = json.data.data.attributes
        const avatar = details.avatar_photo_url
        const cover = details.cover_photo_url
        const created = Functions.formatDate(details.created_at)
        const posts = details.creation_count
        const creating = details.creation_name
        const patrons = details.patron_count
        const sum = (details.pledge_sum / 100.0).toFixed(2)
        const description = Functions.cleanHTML(details.summary.replace(/\<br\>/g, "\n").replace(/&lt;/g, "<").replace(/&gt;/g, ">"))
        const url = details.url
        const fb = json.data?.included[0]?.attributes?.facebook
        const tw = json.data?.included[0]?.attributes?.twitter
        const tc = json.data?.included[0]?.attributes?.twitch
        const yt = json.data?.included[0]?.attributes?.youtube
        const patreonEmbed = embeds.createEmbed()
        patreonEmbed
        .setAuthor("patreon", "https://cdn.vox-cdn.com/thumbor/FkSiWSfqhyDOYUn05rHCljZPBwY=/0x0:1071x1047/1400x933/filters:focal(376x385:546x555):no_upscale()/cdn.vox-cdn.com/uploads/chorus_image/image/57898065/patreon.1512686514.jpg")
        .setTitle(`**Patreon Search** ${discord.getEmoji("raphi")}`)
        .setURL(url)
        .setImage(cover)
        .setThumbnail(avatar)
        .setDescription(
            `${star}_Creator:_ **${details.name}**\n` +
            `${star}_Is Creating:_ **${creating}**\n` +
            `${star}_Creation Date:_ **${created}**\n` +
            `${star}_Posts:_ **${posts}**\n` +
            `${star}_Patrons:_ **${patrons}**\n` +
            `${star}_Monthly Earnings:_ **$${sum}**\n` +
            `${star}_Youtube:_ ${yt ? yt : "None"}\n` +
            `${star}_Twitter:_ ${tw ? `https://www.twitter.com/${tw}` : "None"}\n` +
            `${star}_Twitch:_ ${tc ? tc : "None"}\n` +
            `${star}_Facebook:_ ${fb ? fb : "None"}\n` +
            `${star}_Description:_ ${Functions.checkChar(description, 1700, " ")}`
        )
        return message.channel.send(patreonEmbed)
    }
}
