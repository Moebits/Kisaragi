import {Message, MessageEmbed} from "discord.js"
import snoowrap from "snoowrap"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

const redditArray: MessageEmbed[] = []

export default class Reddit extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public getSubmissions = async (discord: Kisaragi, reddit: snoowrap, embeds: Embeds, postIDS: string[]) => {
        for (let i = 0; i < 10; i++) {
            if (!postIDS[i]) break
            // @ts-ignore
            const post = await reddit.getSubmission(postIDS[i]).fetch()
            const commentArray: string[] = []
            for (let j = 0; j < 3; j++) {
                if (!post.comments[j]) break
                commentArray.push(`**${post.comments[j].author ? post.comments[j].author.name : "Deleted"}**: ${(Functions.checkChar(post.comments[j].body, 150, " ") as string).replace(/(\r\n|\n|\r)/gm, " ")}`)
            }
            const redditEmbed = embeds.createEmbed()
            redditEmbed
            .setAuthor("reddit", "https://cdn0.iconfinder.com/data/icons/most-usable-logos/120/Reddit-512.png")
            .setTitle(`**${post.title}** ${discord.getEmoji("aquaUp")}`)
            .setURL(`https://www.reddit.com/${post.permalink}`)
            .setDescription(
                `${discord.getEmoji("star")}_Subreddit:_ **${post.subreddit.display_name}**\n` +
                `${discord.getEmoji("star")}_Subscribers:_ **${post.subreddit_subscribers}**\n` +
                `${discord.getEmoji("star")}_Author:_ **${post.author ? post.author.name : "Deleted"}**\n` +
                `${discord.getEmoji("star")}${discord.getEmoji("up")} **${Math.ceil(post.ups / post.upvote_ratio)}** ${discord.getEmoji("down")} **${Math.ceil(post.ups / post.upvote_ratio) - post.ups}**\n` +
                `${discord.getEmoji("star")}_Selftext:_ ${post.selftext ? (Functions.checkChar(post.selftext, 800, ".") as string).replace(/(\r\n|\n|\r)/gm, " ") : "None"}\n` +
                `${discord.getEmoji("star")}_Comments:_ ${commentArray.join("") ? commentArray.join("\n") : "None"}\n`
            )
            .setImage(post.url)
            .setThumbnail(post.thumbnail.startsWith("https") ? post.thumbnail : post.url)
            redditArray.push(redditEmbed)
        }
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)

        const reddit = new snoowrap({
            userAgent: "kisaragi bot v1.0 by /u/tenpimusic",
            clientId: process.env.REDDIT_APP_ID,
            clientSecret: process.env.REDDIT_APP_SECRET,
            username: process.env.REDDIT_USERNAME,
            password: process.env.REDDIT_PASSWORD
        })

        if (args[1] === "user") {
            const query = Functions.combineArgs(args, 2)
            // @ts-ignore
            const user = await reddit.getUser(query.trim()).fetch()
            const redditEmbed = embeds.createEmbed()
            redditEmbed
            .setAuthor("reddit", "https://cdn0.iconfinder.com/data/icons/most-usable-logos/120/Reddit-512.png")
            .setTitle(`**${user.name}** ${discord.getEmoji("aquaUp")}`)
            .setURL(`https://www.reddit.com${user.subreddit.display_name.url}`)
            .setImage(user.subreddit.display_name.banner_img)
            .setThumbnail(user.subreddit.display_name.icon_img)
            .setDescription(
                `${discord.getEmoji("star")}_Link Karma:_ **${user.link_karma}**\n` +
                `${discord.getEmoji("star")}_Comment Karma:_ **${user.comment_karma}**\n` +
                `${discord.getEmoji("star")}_Friends:_ **${user.num_friends}**\n` +
                `${discord.getEmoji("star")}_Description:_ ${user.subreddit.display_name.public_description}\n`
            )
            message.channel.send(redditEmbed)
            return
        }

        let posts = {} as snoowrap.Listing<snoowrap.Submission>
        let subreddit = ""
        if (!args[1]) {
            // @ts-ignore
            posts = [await reddit.getRandomSubmission()] as snoowrap.Listing<snoowrap.Submission>
        } else {
            subreddit = args[1]
        }
        if (subreddit) {
            if (args[2]) {
                const query = Functions.combineArgs(args, 2)
                if (args[2].toLowerCase() === "hot") {
                    posts = await reddit.getSubreddit(subreddit).getHot()
                } else if (args[2].toLowerCase() === "new") {
                    posts = await reddit.getSubreddit(subreddit).getNew()
                } else if (args[2].toLowerCase() === "top") {
                    posts = await reddit.getSubreddit(subreddit).getTop({time: "all"})
                } else if (args[2].toLowerCase() === "rising") {
                    posts = await reddit.getSubreddit(subreddit).getRising()
                } else if (args[2].toLowerCase() === "controversial") {
                    posts = await reddit.getSubreddit(subreddit).getControversial()
                } else {
                    posts = await reddit.getSubreddit(subreddit).search({query, time: "all", sort: "relevance"})
                }
            } else {
                // @ts-ignore
                posts = await reddit.getSubreddit(subreddit).getRandomSubmission()
            }
        }
        const postIDS: string[] = []
        for (let i = 0; i < posts.length; i++) {
            if (posts[i]) {
                postIDS.push(posts[i].id)
            }
        }
        if (!postIDS.join("")) {
            const redditEmbed = embeds.createEmbed()
            redditEmbed
                .setAuthor("reddit", "https://cdn0.iconfinder.com/data/icons/most-usable-logos/120/Reddit-512.png")
                .setTitle(`**Reddit Search** ${discord.getEmoji("aquaUp")}`)
                .setDescription("No results were found. Try searching on the reddit website: " +
                "[Reddit Website](https://www.reddit.com)")
            message.channel.send(redditEmbed)
            return
        }
        await this.getSubmissions(discord, reddit, embeds, postIDS)
        if (redditArray.length === 1) {
            message.channel.send(redditArray[0])
        } else {
            embeds.createReactionEmbed(redditArray)
        }
    }
}
