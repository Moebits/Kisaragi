import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

const deviantArt = require("deviantnode")

const deviantArray: MessageEmbed[] = []

export default class DeviantArt extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public createDeviantEmbed = (discord: Kisaragi, embeds: Embeds, result: any) => {
        for (let i = 0; i < result.results.length; i++) {
            const deviation = result.results[i]
            if (!deviation.content) return
            const deviantEmbed = embeds.createEmbed()
            deviantEmbed
            .setAuthor("deviantart", "https://www.shareicon.net/data/512x512/2016/11/22/855126_circle_512x512.png")
            .setTitle(`**DeviantArt Search** ${discord.getEmoji("aquaUp")}`)
            .setURL(deviation.url)
            .setImage(deviation.content.src)
            .setThumbnail(deviation.author.usericon)
            .setDescription(
                `${discord.getEmoji("star")}_Title:_ **${deviation.title}**\n` +
                `${discord.getEmoji("star")}_Author:_ **${deviation.author.username}**\n` +
                `${discord.getEmoji("star")}_Category:_ **${deviation.category}**\n` +
                `${discord.getEmoji("star")}_Creation Date:_ **${Functions.formatDate(new Date((deviation.published_time) * 1000))}**\n` +
                `${discord.getEmoji("star")}_Comments:_ **${deviation.stats.comments}**\n` +
                `${discord.getEmoji("star")}_Favorites:_ **${deviation.stats.favorites ? deviation.stats.favorites : 0}**\n` +
                `${discord.getEmoji("star")}_Description:_ ${deviation.excerpt ? Functions.checkChar(deviation.excerpt, 1900, ".") : "None"}\n`
            )
            deviantArray.push(deviantEmbed)
        }
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const id = process.env.DEVIANTART_discord_ID
        const secret = process.env.DEVIANTART_discord_SECRET

        if (args[1] === "daily") {
            const result = (args[2]) ? await deviantArt.getDailyDeviations(id, secret, {date: args[2]})
            : await deviantArt.getDailyDeviations(id, secret)
            this.createDeviantEmbed(discord, embeds, result)
            if (deviantArray.length === 1) {
                message.channel.send(deviantArray[0])
            } else {
                embeds.createReactionEmbed(deviantArray)
            }
            return
        }

        if (args[1] === "hot") {
            const result = (args[2]) ? await deviantArt.getHotDeviations(id, secret, {category: args[2]})
            : await deviantArt.getHotDeviations(id, secret)

            this.createDeviantEmbed(discord, embeds, result)
            if (deviantArray.length === 1) {
                message.channel.send(deviantArray[0])
            } else {
                embeds.createReactionEmbed(deviantArray)
            }
            return
        }

        if (args[1] === "new") {
            const query = Functions.combineArgs(args, 2)
            const result = (query) ? await deviantArt.getNewestDeviations(id, secret, {q: query})
            : await deviantArt.getNewestDeviations(id, secret)

            this.createDeviantEmbed(discord, embeds, result)
            if (deviantArray.length === 1) {
                message.channel.send(deviantArray[0])
            } else {
                embeds.createReactionEmbed(deviantArray)
            }
            return
        }

        if (args[1] === "popular") {
            const query = Functions.combineArgs(args, 2)
            const result = (query) ? await deviantArt.getPopularDeviations(id, secret, {q: query})
            : await deviantArt.getPopularDeviations(id, secret)

            this.createDeviantEmbed(discord, embeds, result)
            if (deviantArray.length === 1) {
                message.channel.send(deviantArray[0])
            } else {
                embeds.createReactionEmbed(deviantArray)
            }
            return
        }

        if (args[1] === "user") {
            const result = await deviantArt.getUserInfo(id, secret, {username: args[2]})
            const deviantEmbed = embeds.createEmbed()
            deviantEmbed
            .setAuthor("deviantart", "https://www.shareicon.net/data/512x512/2016/11/22/855126_circle_512x512.png")
            .setTitle(`**DeviantArt User** ${discord.getEmoji("aquaUp")}`)
            .setURL(result.profile_url)
            .setThumbnail(result.user.usericon)
            .setImage(result.cover_photo ? result.cover_photo : result.user.usericon)
            .setDescription(
                `${discord.getEmoji("star")}_User:_ **${result.user.username}**\n` +
                `${discord.getEmoji("star")}_Specialty:_ **${result.artist_specialty}**\n` +
                `${discord.getEmoji("star")}_Country:_ **${result.country}**\n` +
                `${discord.getEmoji("star")}_Website:_ **${result.website ? result.website : "None"}**\n` +
                `${discord.getEmoji("star")}_Deviations:_ **${result.stats.user_deviations}**\n` +
                `${discord.getEmoji("star")}_User Favorites:_ **${result.stats.user_favourites}**\n` +
                `${discord.getEmoji("star")}_User Comments:_ **${result.stats.user_comments}**\n` +
                `${discord.getEmoji("star")}_Page Views:_ **${result.stats.profile_pageviews}**\n` +
                `${discord.getEmoji("star")}_Profile Comments:_ **${result.stats.profile_comments}**\n` +
                `${discord.getEmoji("star")}_Tag Line:_ ${result.tagline ? result.tagline : "None"}\n` +
                `${discord.getEmoji("star")}_Description:_ ${Functions.checkChar(result.bio, 1800, ".")}\n`
            )
            message.channel.send(deviantEmbed)
            return
        }

        if (args[1] === "gallery") {
            const result = await deviantArt.getGalleryAllDeviations(id, secret, {username: args[2]})
            this.createDeviantEmbed(discord, embeds, result)
            if (deviantArray.length === 1) {
                message.channel.send(deviantArray[0])
            } else {
                embeds.createReactionEmbed(deviantArray)
            }
            return
        }

        const query = Functions.combineArgs(args, 1)
        const result = await deviantArt.getTagDeviations(id, secret, {tag: query})
        this.createDeviantEmbed(discord, embeds, result)
        if (deviantArray.length === 1) {
                message.channel.send(deviantArray[0])
            } else {
                embeds.createReactionEmbed(deviantArray)
            }
        return
    }
}
