import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"

export default class GooglePlay extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches for apps on the google play store.",
            help:
            `
            \`googleplay query\` - Searches google play with the query.
            `,
            examples:
            `
            \`=>googleplay discord\`
            `,
            aliases: ["gplay", "playstore"],
            cooldown: 15
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const star = discord.getEmoji("star")
        const term = Functions.combineArgs(args, 1).trim()

        if (!term) {
            return this.noQuery(embeds.createEmbed()
            .setAuthor("google play", "https://cdn4.iconfinder.com/data/icons/free-colorful-icons/360/google_play.png")
            .setTitle(`**Google Play Search** ${discord.getEmoji("PoiHug")}`))
        }

        const playstore = require("google-play-scraper")

        const res = await playstore.search({term, num: 50, fullDetail: true})
        const playArray: MessageEmbed[] = []
        for (let i = 0; i < res.length; i++) {
            const app = res[i]
            const playEmbed = embeds.createEmbed()
            playEmbed
            .setAuthor("google play", "https://cdn4.iconfinder.com/data/icons/free-colorful-icons/360/google_play.png")
            .setTitle(`**Google Play Search** ${discord.getEmoji("PoiHug")}`)
            .setURL(app.url)
            .setThumbnail(app.icon)
            .setImage(app.headerImage)
            .setDescription(
                `${star}_App:_ **${app.title}**\n` +
                `${star}_Developer:_ **${app.developer}**\n` +
                `${star}_Summary:_ **${app.summary.replace(/&lt;/g, "<").replace(/&gt;/g, ">")}**\n` +
                `${star}_Release Date:_ **${app.released}**\n` +
                `${star}_Installs:_ **${app.installs}**\n` +
                `${star}_Ratings:_ **${app.ratings}**\n` +
                `${star}_Reviews:_ **${app.reviews}**\n` +
                `${star}_Price:_ **$${app.price}**\n` +
                `${star}_Developer Website:_ ${app.developerWebsite}\n` +
                `${star}_Description:_ ${Functions.checkChar(app.description, 600, " ")}\n` +
                `${star}_Recent Changes:_ ${Functions.checkChar(Functions.cleanHTML(app.recentChanges), 300, " ")}\n` +
                `${star}_Comments:_ ${Functions.checkChar(app.comments.join(" "), 100, " ")}`
            )
            playArray.push(playEmbed)
        }

        if (!playArray[0]) {
            return this.invalidQuery(embeds.createEmbed()
            .setAuthor("google play", "https://cdn4.iconfinder.com/data/icons/free-colorful-icons/360/google_play.png")
            .setTitle(`**Google Play Search** ${discord.getEmoji("PoiHug")}`))
        }

        if (playArray.length === 1) {
            message.channel.send(playArray[0])
        } else {
            embeds.createReactionEmbed(playArray)
        }
        return
    }
}
