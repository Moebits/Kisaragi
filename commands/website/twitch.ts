import {Message, MessageEmbed} from "discord.js"
import TwitchClient from "twitch"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Twitch extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches twitch.",
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const twitch = await TwitchClient.withCredentials(process.env.TWITCH_CLIENT_ID!, process.env.TWITCH_ACCESS_TOKEN)

        if (args[1] === "channel") {
            const term = args[2]
            const result = await twitch.kraken.search.searchChannels(term, 1, 1)
            const twitchEmbed = embeds.createEmbed()
            twitchEmbed
            .setAuthor("twitch", "http://videoadnews.com/wp-content/uploads/2014/05/twitch-icon-box.jpg")
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
            message.channel.send(twitchEmbed)
            return
        }

        const term = Functions.combineArgs(args, 1)
        const result = await twitch.kraken.search.searchStreams(term.trim(), 1, 11)
        const twitchArray: MessageEmbed[] = []
        for (let i = 0; i < result.length; i++) {
            const twitchEmbed = embeds.createEmbed()
            twitchEmbed
            .setAuthor("twitch", "http://videoadnews.com/wp-content/uploads/2014/05/twitch-icon-box.jpg")
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

        embeds.createReactionEmbed(twitchArray)
    }
}
