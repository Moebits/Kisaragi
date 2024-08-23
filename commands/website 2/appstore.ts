import {Message, EmbedBuilder} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

export default class AppStore extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches for apps on the iphone app store.",
            help:
            `
            \`appstore query\` - Searches the app store with the query.
            \`appstore url\` - Searches for the url
            `,
            examples:
            `
            \`=>appstore geometry dash\`
            `,
            aliases: ["app", "istore"],
            random: "string",
            cooldown: 15
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        if (discord.checkMuted(message)) if (!perms.checkNSFW()) return

        const store = require("app-store-scraper")
        let term = Functions.combineArgs(args, 1).trim()
        if (!term) {
            return this.noQuery(embeds.createEmbed()
            .setAuthor({name: "app store", iconURL: "https://i.pinimg.com/originals/45/13/0a/45130a9d775c2aefcc124f96f69dbe9a.jpg", url: "https://fnd.io/"})
            .setTitle(`**App Store Search** ${discord.getEmoji("PoiHug")}`))
        }
        if (term.match(/apps.apple.com/)) {
            term = term.match(/(?<=app\/)(.*?)(?=\/)/)?.[0].replace(/-/g, " ")!
        }
        const response = await store.search({term})
        const appArray: EmbedBuilder[] = []
        for (let i = 0; i < response.length; i++) {
            const app = response[i]
            const appEmbed = embeds.createEmbed()
            appEmbed
            .setAuthor({name: "app store", iconURL: "https://i.pinimg.com/originals/45/13/0a/45130a9d775c2aefcc124f96f69dbe9a.jpg", url: "https://fnd.io/"})
            .setTitle(`**App Store Search** ${discord.getEmoji("PoiHug")}`)
            .setURL(app.url)
            .setThumbnail(app.icon)
            .setImage(app.screenshots[0])
            .setDescription(
                `${discord.getEmoji("star")}_App:_ **${app.title}**\n` +
                `${discord.getEmoji("star")}_Developer_: **${app.developer}**\n` +
                `${discord.getEmoji("star")}_Release Date:_ **${Functions.formatDate(app.released)}**\n` +
                `${discord.getEmoji("star")}_Last Updated:_ **${Functions.formatDate(app.updated)}**\n` +
                `${discord.getEmoji("star")}_Version:_ **${app.version}**\n` +
                `${discord.getEmoji("star")}_Price:_ **$${app.price}**\n` +
                `${discord.getEmoji("star")}_Score:_ **${app.score}**\n` +
                `${discord.getEmoji("star")}_Reviews:_ **${app.reviews}**\n` +
                `${discord.getEmoji("star")}_Developer Website:_ ${app.developerWebsite}\n` +
                `${discord.getEmoji("star")}_Description:_ ${Functions.checkChar(app.description, 700, " ")}\n` +
                `${discord.getEmoji("star")}_Release Notes:_ ${Functions.checkChar(app.releaseNotes, 300, " ")}`
            )
            appArray.push(appEmbed)
        }
        if (!appArray[0]) {
            return this.invalidQuery(embeds.createEmbed()
            .setAuthor({name: "app store", iconURL: "https://i.pinimg.com/originals/45/13/0a/45130a9d775c2aefcc124f96f69dbe9a.jpg", url: "https://fnd.io/"})
            .setTitle(`**App Store Search** ${discord.getEmoji("PoiHug")}`))
        }
        if (appArray.length === 1) {
            message.channel.send({embeds: [appArray[0]]})
        } else {
            embeds.createReactionEmbed(appArray, true, true)
        }
        return
    }
}
