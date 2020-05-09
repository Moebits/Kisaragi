import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"

const imgur = require("imgur")

export default class Imgur extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches for images on imgur.",
            help:
            `
            \`imgur query\` - Searches for images with the query
            `,
            examples:
            `
            \`=>imgur anime\`
            `,
            aliases: ["img", "image"],
            random: "string",
            cooldown: 5,
            nsfw: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        if (discord.checkMuted(message)) {
            if (!perms.checkNSFW()) return
        }
        await imgur.setClientId(process.env.IMGUR_discord_ID)
        await imgur.setAPIUrl("https://api.imgur.com/3/")

        const query = Functions.combineArgs(args, 1)
        if (!query) {
            return this.noQuery(embeds.createEmbed()
            .setAuthor("imgur", "https://i.imgur.com/kpLlF3Y.jpg")
            .setTitle(`**Imgur Search** ${discord.getEmoji("kannaWave")}`)
            )
        }

        let image: any
        if (query.match(/imgur.com/)) {
            const id = query.match(/(?<=\/)(?:.(?!\/))+$/)![0].replace(/.(png|jpg|gif)/, "")
            image = await imgur.getInfo(id).then((i: any) => i.data)
            const imgurEmbed = embeds.createEmbed()
            let extension
            switch (image.type.slice(-3)) {
                case "mp4": extension = "gif"; break
                case "peg": extension = "jpeg"; break
                default: extension = image.type.slice(-3)
            }
            const cover = `https://imgur.com/${image.id}.${extension}`
            imgurEmbed
            .setAuthor("imgur", "https://i.imgur.com/kpLlF3Y.jpg", "https://imgur.com/")
            .setURL(image.link)
            .setTitle(`**Imgur Search** ${discord.getEmoji("kannaWave")}`)
            .setDescription(
                `${discord.getEmoji("star")}_Title:_ **${image.title ?? "None"}**\n` +
                `${discord.getEmoji("star")}_Account:_ **${image.account_url ?? "None"}**\n` +
                `${discord.getEmoji("star")}**${image.ups ?? 0}** ${discord.getEmoji("thumbsUp")} **${image.downs ?? 0}** ${discord.getEmoji("thumbsDown")}\n` +
                `${discord.getEmoji("star")}_Views:_ **${image.views}**\n` +
                `${discord.getEmoji("star")}_Animated:_ **${image.animated ? "Yes" : "No"}**\n` +
                `${discord.getEmoji("star")}_Description:_ ${image.description ? image.description : "None"}\n`
            )
            .setImage(cover)
            message.channel.send(imgurEmbed)
            return
        } else {
            const json = await imgur.search(query)
            const random = Math.floor(Math.random() * json.data.length)
            image = json.data[random]
        }
        if (!image) {
            const imgurEmbed = embeds.createEmbed()
            imgurEmbed
            .setAuthor("imgur", "https://i.imgur.com/kpLlF3Y.jpg", "https://imgur.com/")
            .setTitle(`**Imgur Search** ${discord.getEmoji("kannaWave")}`)
            .setDescription("No results were found! Try searching for a tag on the imgur website.\n" +
            "[Imgur Website](https://imgur.com/)")
            message.channel.send(imgurEmbed)
            return
        } else if (image.images.length === 1) {
            const imgurEmbed = embeds.createEmbed()
            let extension
            switch (image.images[0].type.slice(-3)) {
                case "mp4": extension = "gif"; break
                case "peg": extension = "jpeg"; break
                default: extension = image.images[0].type.slice(-3)
            }
            const cover = `https://imgur.com/${image.images[0].id}.${extension}`
            imgurEmbed
            .setAuthor("imgur", "https://i.imgur.com/kpLlF3Y.jpg", "https://imgur.com/")
            .setURL(image.link)
            .setTitle(`**Imgur Search** ${discord.getEmoji("kannaWave")}`)
            .setDescription(
                `${discord.getEmoji("star")}_Title:_ **${image.title ?? "None"}**\n` +
                `${discord.getEmoji("star")}_Account:_ **${image.account_url ?? "None"}**\n` +
                `${discord.getEmoji("star")}**${image.ups ?? 0}** ${discord.getEmoji("thumbsUp")} **${image.downs ?? 0}** ${discord.getEmoji("thumbsDown")}\n` +
                `${discord.getEmoji("star")}_Views:_ **${image.views}**\n` +
                `${discord.getEmoji("star")}_Animated:_ **${image.images[0].animated ? "Yes" : "No"}**\n` +
                `${discord.getEmoji("star")}_Description:_ ${image.description ? image.description : "None"}\n`
            )
            .setImage(cover)
            message.channel.send(imgurEmbed)
            return
        } else {
            const imageArray: MessageEmbed[] = []
            for (let i = 0; i < image.images.length - 1; i++) {
                const imgurEmbed = embeds.createEmbed()
                let extension
                switch (image.images[i].type.slice(-3)) {
                    case "mp4": extension = "gif"; break
                    case "peg": extension = "jpeg"; break
                    default: extension = image.images[i].type.slice(-3)
                }
                const cover = `https://imgur.com/${image.images[i].id}.${extension}`
                imgurEmbed
                .setAuthor("imgur", "https://i.imgur.com/kpLlF3Y.jpg", "https://imgur.com/")
                .setURL(image.link)
                .setTitle(`**Imgur Search** ${discord.getEmoji("kannaWave")}`)
                .setDescription(
                    `${discord.getEmoji("star")}_Title:_ **${image.title ?? "None"}**\n` +
                    `${discord.getEmoji("star")}_Account:_ **${image.account_url ?? "None"}**\n` +
                    `${discord.getEmoji("star")}**${image.ups ?? 0}** ${discord.getEmoji("thumbsUp")} **${image.downs ?? 0}** ${discord.getEmoji("thumbsDown")}\n` +
                    `${discord.getEmoji("star")}_Views:_ **${image.views}**\n` +
                    `${discord.getEmoji("star")}_Animated:_ **${image.images[i].animated ? "Yes" : "No"}**\n` +
                    `${discord.getEmoji("star")}_Description:_ ${image.description ? image.description : "None"}\n`
                )
                .setImage(cover)
                imageArray.push(imgurEmbed)
            }
            embeds.createReactionEmbed(imageArray, true, true)
        }
    }
}
