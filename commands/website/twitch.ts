import type {Message, EmbedBuilder} from "discord.js"
import {SlashCommandOption} from "../../structures/SlashCommandOption"
import TwitchClient from "twitch"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Twitch extends Command {
    private channel = null as any
    private search = null as any
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Searches for twitch streams and channels.",
            help:
            `
            \`twitch query\` - Searches for streams with the query
            \`twitch channel query\` - Searches for a channel
            \`twitch url\` - Gets the resource from the url
            `,
            examples:
            `
            \`=>twitch osu\`
            \`=>twitch channel imtenpi\`
            `,
            aliases: ["tw"],
            random: "string",
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        const twitch = TwitchClient.withCredentials(process.env.TWITCH_CLIENT_ID!, process.env.TWITCH_ACCESS_TOKEN!)

        if (args[1]?.match(/twitch.tv/)) {
            const matches = args[1].replace("https://www.twitch.tv", "").match(/(?<=\/)(.*?)(?=$|\/)/g)
            this.channel = matches?.[0]
            if (this.channel.includes("search")) {
                this.search = matches?.[0].replace("search?term=", "")
                this.channel = null
            }
        }

        if (this.channel || args[1] === "channel") {
            const term = this.channel || args[2]
            if (!term) {
                return this.noQuery(embeds.createEmbed()
                .setAuthor({name: "twitch", iconURL: "http://videoadnews.com/wp-content/uploads/2014/05/twitch-icon-box.jpg", url: "https://www.twitch.tv/"})
                .setTitle(`**Twitch Channel** ${discord.getEmoji("gabSip")}`))
            }
            const result = await twitch.kraken.search.searchChannels(term, 1, 1)
            const twitchEmbed = embeds.createEmbed()
            twitchEmbed
            .setAuthor({name: "twitch", iconURL: "http://videoadnews.com/wp-content/uploads/2014/05/twitch-icon-box.jpg", url: "https://www.twitch.tv/"})
            .setTitle(`**Twitch Channel** ${discord.getEmoji("gabSip")}`)
            .setURL(result[0].url)
            .setThumbnail(result[0].logo)
            .setImage(result[0].profileBanner as string)
            .setDescription(
                `${discord.getEmoji("star")}_Name:_ **${result[0].name}**\n` +
                `${discord.getEmoji("star")}_Creation Date:_ **${Functions.formatDate(new Date(result[0].creationDate.getTime()))}**\n` +
                `${discord.getEmoji("star")}_Views:_ **${result[0].views}**\n` +
                `${discord.getEmoji("star")}_Followers:_ **${result[0].followers}**\n` +
                `${discord.getEmoji("star")}_Status:_ **${result[0].status}**\n` +
                `${discord.getEmoji("star")}_Game:_ **${result[0].game}**\n` +
                `${discord.getEmoji("star")}_Description:_ ${result[0].description}\n`
            )
            message.channel.send({embeds: [twitchEmbed]})
            return
        }

        const term = this.search || Functions.combineArgs(args, 1)
        if (!term) {
            return this.noQuery(embeds.createEmbed()
            .setAuthor({name: "twitch", iconURL: "http://videoadnews.com/wp-content/uploads/2014/05/twitch-icon-box.jpg", url: "https://www.twitch.tv/"})
            .setTitle(`**Twitch Stream** ${discord.getEmoji("gabSip")}`))
        }
        const result = await twitch.kraken.search.searchStreams(term.trim(), 1, 11)
        const twitchArray: EmbedBuilder[] = []
        for (let i = 0; i < result.length; i++) {
            const twitchEmbed = embeds.createEmbed()
            twitchEmbed
            .setAuthor({name: "twitch", iconURL: "http://videoadnews.com/wp-content/uploads/2014/05/twitch-icon-box.jpg", url: "https://www.twitch.tv/"})
            .setTitle(`**Twitch Stream** ${discord.getEmoji("gabSip")}`)
            .setURL(result[i].channel.url)
            .setImage(result[i].getPreviewUrl("large"))
            .setThumbnail(result[i].channel.logo)
            .setDescription(
                `${discord.getEmoji("star")}_Title:_ **${result[i].channel.status}**\n` +
                `${discord.getEmoji("star")}_Channel:_ **${result[i].channel.name}**\n` +
                `${discord.getEmoji("star")}_Game:_ **${result[i].channel.game}**\n` +
                `${discord.getEmoji("star")}_Viewers:_ **${result[i].viewers}**\n` +
                `${discord.getEmoji("star")}_Creation Date:_ **${Functions.formatDate(new Date(result[i].startDate.getTime()))}**\n` +
                `${discord.getEmoji("star")}_FPS:_ **${Math.floor(result[i].averageFPS)}**\n` +
                `${discord.getEmoji("star")}_Description:_ ${result[i].channel.description}\n`
            )
            twitchArray.push(twitchEmbed)
        }
        embeds.createReactionEmbed(twitchArray, true, true)
    }
}
