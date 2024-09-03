import {Message, EmbedBuilder} from "discord.js"
import GoogleImages from "google-images"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"

export default class GoogleImageCommand extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Searches for images on google images.",
            help:
            `
            \`images query\` - Searches google images for the query.
            `,
            examples:
            `
            \`=>images anime\`
            `,
            aliases: ["i", "image", "googleimages"],
            random: "string",
            cooldown: 10,
            nsfw: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        if (!perms.checkNSFW()) return
        let query = Functions.combineArgs(args, 1)
        if (!query) {
            return this.noQuery(embeds.createEmbed()
            .setAuthor({name: "google images", iconURL: "https://cdn4.iconfinder.com/data/icons/new-google-logo-2015/400/new-google-favicon-512.png", url: "https://images.google.com/"})
            .setTitle(`**Image Search** ${discord.getEmoji("raphi")}`)
            )
        }

        if (query.match(/google.com/)) {
            query = query.match(/(?<=search\?q=)(.*?)(?=&)/)?.[0].replace(/\+/g, " ")!
        }

        const images = new GoogleImages(process.env.GOOGLE_IMAGES_ID!, process.env.GOOGLE_API_KEY!)

        if (/hentai|porn|sex|nsfw/.test(query) || discord.checkMuted(message)) {
            if (!perms.checkNSFW()) return
        }

        const result = await images.search(query)
        const imagesArray: EmbedBuilder[] = []
        for (let i = 0; i < result.length; i++) {
            const imageEmbed = embeds.createEmbed()
            const size = Math.floor(result[i].size/1024)
            imageEmbed
            .setAuthor({name: "google images", iconURL: "https://cdn4.iconfinder.com/data/icons/new-google-logo-2015/400/new-google-favicon-512.png", url: "https://images.google.com/"})
            .setURL(result[i].url)
            .setTitle(`**Image Search** ${discord.getEmoji("raphi")}`)
            .setDescription(
                `${discord.getEmoji("star")}_Website:_ ${result[i].url}\n` +
                `${discord.getEmoji("star")}_Width:_ ${result[i].width} _Height:_ ${result[i].height}\n` +
                `${discord.getEmoji("star")}_Filesize:_ ${size}KB\n` +
                `${discord.getEmoji("star")}_Description:_ ${result[i].type}`
            )
            .setImage(result[i].url)
            imagesArray.push(imageEmbed)
        }
        embeds.createReactionEmbed(imagesArray, true, true)
    }
}
