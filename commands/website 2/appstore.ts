import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"

export default class AppStore extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches for apps on the iphone app store.",
            help:
            `
            \`appstore query\` - Searches the app store with the query.
            `,
            examples:
            `
            \`=>appstore geometry dash\`
            `,
            aliases: ["app", "istore"],
            cooldown: 15
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const star = discord.getEmoji("star")

        const store = require("app-store-scraper")
        const term = Functions.combineArgs(args, 1).trim()
        if (!term) {
            return this.noQuery(embeds.createEmbed()
            .setAuthor("app store", "https://i.pinimg.com/originals/45/13/0a/45130a9d775c2aefcc124f96f69dbe9a.jpg")
            .setTitle(`**App Store Search** ${discord.getEmoji("PoiHug")}`))
        }
        const response = await store.search({term})
        const appArray: MessageEmbed[] = []
        for (let i = 0; i < response.length; i++) {
            const app = response[i]
            const appEmbed = embeds.createEmbed()
            appEmbed
            .setAuthor("app store", "https://i.pinimg.com/originals/45/13/0a/45130a9d775c2aefcc124f96f69dbe9a.jpg")
            .setTitle(`**App Store Search** ${discord.getEmoji("PoiHug")}`)
            .setURL(app.url)
            .setThumbnail(app.icon)
            .setImage(app.screenshots[0])
            .setDescription(
                `${star}_App:_ **${app.title}**\n` +
                `${star}_Developer_: **${app.developer}**\n` +
                `${star}_Release Date:_ **${Functions.formatDate(app.released)}**\n` +
                `${star}_Last Updated:_ **${Functions.formatDate(app.updated)}**\n` +
                `${star}_Version:_ **${app.version}**\n` +
                `${star}_Price:_ **$${app.price}**\n` +
                `${star}_Score:_ **${app.score}**\n` +
                `${star}_Reviews:_ **${app.reviews}**\n` +
                `${star}_Developer Website:_ ${app.developerWebsite}\n` +
                `${star}_Description:_ ${Functions.checkChar(app.description, 700, " ")}\n` +
                `${star}_Release Notes:_ ${Functions.checkChar(app.releaseNotes, 300, " ")}`
            )
            appArray.push(appEmbed)
        }
        if (!appArray[0]) {
            return this.invalidQuery(embeds.createEmbed()
            .setAuthor("app store", "https://i.pinimg.com/originals/45/13/0a/45130a9d775c2aefcc124f96f69dbe9a.jpg")
            .setTitle(`**App Store Search** ${discord.getEmoji("PoiHug")}`))
        }
        if (appArray.length === 1) {
            message.channel.send(appArray[0])
        } else {
            embeds.createReactionEmbed(appArray)
        }
        return
    }
}
