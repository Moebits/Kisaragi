import {Message, MessageEmbed, User} from "discord.js"
import Sagiri from "sagiri"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Saucenao extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Finds the source of an anime picture.",
            help:
            `
            \`saucenao\` - Searches the last posted image
            \`sauceno url\` - Searches the linked image
            `,
            examples:
            `
            \`=>saucenao\`
            `,
            aliases: ["sn"],
            cooldown: 10
        })
    }

    public getDetails = (source: any) => {
        const discord = this.discord
        let description = ""
        let url = ""
        let i = 0
        while (description.length < 1600 && source[i]) {
            switch (source[i].site) {
                case "Pixiv":
                    description += `${discord.getEmoji("star")}_Site:_ **Pixiv**\n` +
                    `${discord.getEmoji("star")}_Similarity:_ **${source[i].similarity}**\n` +
                    `${discord.getEmoji("star")}_Title:_ **${source[i]?.raw?.data?.title ?? "Not found"}**\n` +
                    `${discord.getEmoji("star")}_Artist:_ **${source[i]?.raw?.data?.member_name ?? "Not found"}**\n` +
                    `${discord.getEmoji("star")}_Pixiv Link:_ **${source[i]?.raw?.data?.pixiv_id ? `https://www.pixiv.net/en/artworks/${source[i]?.raw?.data?.pixiv_id}` : "Not found"}**\n` +
                    `${discord.getEmoji("star")}_Artist Link:_ **${source[i]?.raw?.data?.member_id ? `https://www.pixiv.net/en/users/${source[i].raw.data.member_id}` : "Not found"}**\n`
                    if (!url) url = `https://www.pixiv.net/en/artworks/${source[i]?.raw?.data?.pixiv_id}`
                    break
                default:
                    description +=
                    `${discord.getEmoji("star")}_Site:_ **${Functions.toProperCase(source[i].site.replace("-", " "))}**\n` +
                    `${discord.getEmoji("star")}_Similarity:_ **${source[i].similarity}**\n` +
                    `${discord.getEmoji("star")}_Title:_ **${source[i]?.raw?.data?.title ?? "Not found"}**\n` +
                    `${discord.getEmoji("star")}_Artist:_ **${source[i]?.raw?.data?.member_name ?? "Not found"}**\n` +
                    `${discord.getEmoji("star")}_${Functions.toProperCase(source[i].site.replace("-", " "))} Link:_ ${source[i]?.raw?.data?.ext_urls ? source[i]?.raw?.data?.ext_urls[0] : "Not found"}\n` +
                    `${discord.getEmoji("star")}_Artist Link:_ ${source[i].authorUrl ?? "Not found"}\n`
                    if (!url) url = source[i]?.raw?.data?.ext_urls ? source[i]?.raw?.data?.ext_urls[0] : ""
            }
            description += "\n"
            i++
        }
        return {description, url}
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const sagiri = Sagiri(process.env.SAUCENAO_API_KEY!)
        let image: string | undefined
        let author: User | undefined

        if (args[1]) {
            image = args[1]
            author = message.author
        } else {
            const result = await discord.fetchLastAttachment(message, true)
            image = result.image
            author = result.author
        }

        if (!image) {
            return this.noQuery(embeds.createEmbed()
            .setAuthor("saucenao", "https://www.userlogos.org/files/logos/zoinzberg/SauceNAO_2.png")
            .setTitle(`**Saucenao Search** ${discord.getEmoji("gabrielLick")}`), "No image could be found.")
        }

        const source = await sagiri(image)
        const {description, url} = this.getDetails(source)
        const siteEmbed = embeds.createEmbed()
        siteEmbed
        .setAuthor("saucenao", "https://www.userlogos.org/files/logos/zoinzberg/SauceNAO_2.png")
        .setTitle(`**Saucenao Search** ${discord.getEmoji("gabrielLick")}`)
        .setThumbnail(author?.displayAvatarURL({format: "png", dynamic: true}) ?? "")
        .setURL(url)
        .setImage(image)
        .setDescription(Functions.checkChar(description, 2000, " "))
        return message.channel.send(siteEmbed)
    }
}
