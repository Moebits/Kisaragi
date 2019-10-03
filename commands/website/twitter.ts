import {Message, MessageEmbed} from "discord.js"
import Twitter from "twitter"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class TwitterCommand extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {

        const embeds = new Embeds(discord, message)
        const twitter = new Twitter({
            consumer_key: process.env.TWITTER_API_KEY!,
            consumer_secret: process.env.TWITTER_API_SECRET!,
            access_token_key: process.env.TWITTER_ACCESS_TOKEN!,
            access_token_secret: process.env.TWITTER_ACCESS_SECRET!
        })

        if (args[1] === "user") {
            const name = Functions.combineArgs(args, 2)
            const users = await twitter.get("users/lookup", {screen_name: name})
            const user = users[0]
            const twitterEmbed = embeds.createEmbed()
            twitterEmbed
            .setAuthor("twitter", "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c53e.png")
            .setTitle(`**${user.name}** ${discord.getEmoji("aquaUp")}`)
            .setURL(`https://twitter.com/${user.screen_name}`)
            .setDescription(
                `${discord.getEmoji("star")}_Username:_ **${user.screen_name}**\n` +
                `${discord.getEmoji("star")}_Tweets:_ **${user.statuses_count}**\n` +
                `${discord.getEmoji("star")}_Followers:_ **${user.followers_count}**\n` +
                `${discord.getEmoji("star")}_Following:_ **${user.friends_count}**\n` +
                `${discord.getEmoji("star")}_Favorites:_ **${user.favourites_count}**\n` +
                `${discord.getEmoji("star")}_Creation Date:_ **${Functions.formatDate(user.created_at)}**\n` +
                `${discord.getEmoji("star")}_Location:_ ${user.location ? user.location : "None"}\n` +
                `${discord.getEmoji("star")}_Description:_ ${user.description ? user.description : "None"}\n` +
                `${discord.getEmoji("star")}_Last Tweet:_ ${user.status.text}\n`
                )
            .setThumbnail(user.profile_image_url)
            .setImage(user.profile_banner_url)
            message.channel.send(twitterEmbed)
            return
        }

        const query = Functions.combineArgs(args, 1)
        const tweets = await twitter.get("search/tweets", {q: query})
        const twitterArray: MessageEmbed[] = []
        for (const i in tweets.statuses) {
            const twitterEmbed = embeds.createEmbed()
            twitterEmbed
            .setAuthor("twitter", "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c53e.png")
            .setTitle(`**Twitter Search** ${discord.getEmoji("aquaUp")}`)
            .setURL(`https://twitter.com/${tweets.statuses[i].user.screen_name}/status/${tweets.statuses[i].id_str}`)
            .setDescription(
                `${discord.getEmoji("star")}_Author:_ **${tweets.statuses[i].user.screen_name}**\n` +
                `${discord.getEmoji("star")}_Location:_ ${tweets.statuses[i].user.location ? tweets.statuses[i].user.location : "None"}\n` +
                `${discord.getEmoji("star")}_Description:_ ${tweets.statuses[i].user.description ? tweets.statuses[i].user.description : "None"}\n` +
                `${discord.getEmoji("star")}_Favorites:_ **${tweets.statuses[i].favorite_count}**\n` +
                `${discord.getEmoji("star")}_Retweets:_ **${tweets.statuses[i].retweet_count}**\n` +
                `${discord.getEmoji("star")}_Creation Date:_ **${Functions.formatDate(tweets.statuses[i].created_at)}**\n` +
                `${discord.getEmoji("star")}_Language:_ **${tweets.statuses[i].lang}**\n` +
                `${discord.getEmoji("star")}_Tweet:_ ${tweets.statuses[i].text}\n`
                )
            .setThumbnail(tweets.statuses[i].user.profile_image_url_https)
            .setImage(tweets.statuses[i].entities.media ? tweets.statuses[i].entities.media[0].media_url : tweets.statuses[i].user.profile_banner_url)
            twitterArray.push(twitterEmbed)
        }
        embeds.createReactionEmbed(twitterArray)
    }
}
