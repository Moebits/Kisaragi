import {Collection, Emoji, Message, MessageAttachment, MessageCollector, MessageEmbed, MessageEmbedThumbnail, MessageReaction, ReactionEmoji, User} from "discord.js"
import fs from "fs"
import path from "path"
import snoowrap from "snoowrap"
import Twitter from "twitter"
import RedditCmd from "../commands/reddit/reddit"
import {Embeds} from "./Embeds"
import {Functions} from "./Functions"
import {Images} from "./Images"
import {Kisaragi} from "./Kisaragi.js"
import {SQLQuery} from "./SQLQuery"

export class Oauth2 {
    private readonly sql = new SQLQuery(this.message)
    private readonly embeds = new Embeds(this.discord, this.message)
    private readonly redditCmd = new RedditCmd(this.discord, this.message)
    constructor(private readonly discord: Kisaragi, private readonly message: Message) {}

    /** Add Reddit options to a reddit embed */
    public redditOptions = async (msg: Message) => {
        const reactions = ["upvote", "downvote", "comment", "redditsave", "subscribe"]
        for (let i = 0; i < reactions.length; i++) await msg.react(this.discord.getEmoji(reactions[i]))

        const upvoteCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("upvote") && user.bot === false
        const downvoteCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("downvote") && user.bot === false
        const commentCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("comment") && user.bot === false
        const saveCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("redditsave") && user.bot === false
        const subscribeCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("subscribe") && user.bot === false

        const upvote = msg.createReactionCollector(upvoteCheck)
        const downvote = msg.createReactionCollector(downvoteCheck)
        const comment = msg.createReactionCollector(commentCheck)
        const save = msg.createReactionCollector(saveCheck)
        const subscribe = msg.createReactionCollector(subscribeCheck)

        const refreshToken = await this.sql.fetchColumn("oauth2", "reddit refresh", "user id", this.message.author.id)

        let options = {username: process.env.REDDIT_USERNAME, password: process.env.REDDIT_PASSWORD} as any
        if (refreshToken) options = {refreshToken}

        const reddit = new snoowrap({
            userAgent: "kisaragi bot v1.0 by /u/imtenpi",
            clientId: process.env.REDDIT_APP_ID,
            clientSecret: process.env.REDDIT_APP_SECRET,
            ...options
        })

        upvote.on("collect", async (reaction, user) => {
            await reaction.users.remove(user).catch(() => null)
            const refreshToken = await this.sql.fetchColumn("oauth2", "reddit refresh", "user id", this.message.author.id)
            if (!refreshToken) {
                const rep = await msg.channel.send(`<@${user.id}>, you must authenticate your reddit account with **redditoauth** in order to upvote this post.`)
                await rep.delete({timeout: 3000})
                return
            }
            reddit.refreshToken = refreshToken
            const postID = msg.embeds[0].url?.match(/(?<=comments\/)(.*?)(?=\/)/)?.[0] ?? ""
            // @ts-ignore
            const post = await reddit.getSubmission(postID).fetch() as snoowrap.Submission
            // @ts-ignore
            await post.upvote()
            const newEmbed = await this.redditCmd.getSubmissions(reddit, [postID])
            await msg.edit(newEmbed[0])
            const rep2 = await msg.channel.send(`<@${user.id}>, Upvoted this post! ${this.discord.getEmoji("aquaUp")}`)
            rep2.delete({timeout: 3000})
        })

        downvote.on("collect", async (reaction, user) => {
            await reaction.users.remove(user).catch(() => null)
            const refreshToken = await this.sql.fetchColumn("oauth2", "reddit refresh", "user id", this.message.author.id)
            if (!refreshToken) {
                const rep = await msg.channel.send(`<@${user.id}>, you must authenticate your reddit account with **redditoauth** in order to downvote this post.`)
                await rep.delete({timeout: 3000})
                return
            }
            reddit.refreshToken = refreshToken
            const postID = msg.embeds[0].url?.match(/(?<=comments\/)(.*?)(?=\/)/)?.[0] ?? ""
            // @ts-ignore
            const post = await reddit.getSubmission(postID).fetch() as snoowrap.Submission
            // @ts-ignore
            await post.downvote()
            const newEmbed = await this.redditCmd.getSubmissions(reddit, [postID])
            await msg.edit(newEmbed[0])
            const rep2 = await msg.channel.send(`<@${user.id}>, Downvoted this post! ${this.discord.getEmoji("sagiriBleh")}`)
            rep2.delete({timeout: 3000})
        })

        comment.on("collect", async (reaction, user) => {
            await reaction.users.remove(user).catch(() => null)
            const refreshToken = await this.sql.fetchColumn("oauth2", "reddit refresh", "user id", this.message.author.id)
            if (!refreshToken) {
                const rep = await msg.channel.send(`<@${user.id}>, you must authenticate your reddit account with **redditoauth** in order to comment on this post.`)
                await rep.delete({timeout: 3000})
                return
            }
            reddit.refreshToken = refreshToken
            const postID = msg.embeds[0].url?.match(/(?<=comments\/)(.*?)(?=\/)/)?.[0] ?? ""
            // @ts-ignore
            const post = await reddit.getSubmission(postID).fetch() as snoowrap.Submission
            let text = ""
            const getComment = (response: Message) => {
                text = response.content.trim()
                response.delete().catch(() => null)
            }
            const rep = await this.message.channel.send(`<@${user.id}>, Enter the comment that you want to leave on this post.`)
            await this.embeds.createPrompt(getComment)
            rep.delete()
            if (!text) {
                const rep = await this.message.channel.send(`<@${user.id}>, You didn't provide a comment ${this.discord.getEmoji("kannaFacepalm")}`)
                await rep.delete({timeout: 3000})
                return
            }
            // @ts-ignore
            await post.reply(text)
            const newEmbed = await this.redditCmd.getSubmissions(reddit, [postID])
            await msg.edit(newEmbed[0])
            const rep2 = await msg.channel.send(`<@${user.id}>, Commented on this post! ${this.discord.getEmoji("gabYes")}`)
            rep2.delete({timeout: 3000})
        })

        save.on("collect", async (reaction, user) => {
            await reaction.users.remove(user).catch(() => null)
            const refreshToken = await this.sql.fetchColumn("oauth2", "reddit refresh", "user id", this.message.author.id)
            if (!refreshToken) {
                const rep = await msg.channel.send(`<@${user.id}>, you must authenticate your reddit account with **redditoauth** in order to save this post.`)
                await rep.delete({timeout: 3000})
                return
            }
            reddit.refreshToken = refreshToken
            const postID = msg.embeds[0].url?.match(/(?<=comments\/)(.*?)(?=\/)/)?.[0] ?? ""
            // @ts-ignore
            const post = await reddit.getSubmission(postID).fetch() as snoowrap.Submission
            let rep2: Message
            if (post.saved) {
                // @ts-ignore
                await post.unsave()
                rep2 = await msg.channel.send(`<@${user.id}>, Unsaved this post! ${this.discord.getEmoji("think")}`)
            } else {
                // @ts-ignore
                await post.save()
                rep2 = await msg.channel.send(`<@${user.id}>, Saved this post! ${this.discord.getEmoji("yes")}`)
            }
            rep2.delete({timeout: 3000})
        })

        subscribe.on("collect", async (reaction, user) => {
            await reaction.users.remove(user).catch(() => null)
            const refreshToken = await this.sql.fetchColumn("oauth2", "reddit refresh", "user id", this.message.author.id)
            if (!refreshToken) {
                const rep = await msg.channel.send(`<@${user.id}>, you must authenticate your reddit account with **redditoauth** in order to subscribe to this subreddit.`)
                await rep.delete({timeout: 3000})
                return
            }
            reddit.refreshToken = refreshToken
            const postID = msg.embeds[0].url?.match(/(?<=comments\/)(.*?)(?=\/)/)?.[0] ?? ""
            // @ts-ignore
            const post = await reddit.getSubmission(postID).fetch() as snoowrap.Submission
            // @ts-ignore
            const sub = await post.subreddit.fetch() as snoowrap.Subreddit
            let rep2: Message
            if (sub.user_is_subscriber) {
                // @ts-ignore
                await sub.unsubscribe()
                rep2 = await msg.channel.send(`<@${user.id}>, Unsubscribed from this subreddit! ${this.discord.getEmoji("mexShrug")}`)
            } else {
                // @ts-ignore
                await sub.subscribe()
                rep2 = await msg.channel.send(`<@${user.id}>, Subscribed to this subreddit! ${this.discord.getEmoji("aquaUp")}`)
            }
            rep2.delete({timeout: 3000})
            const newEmbed = await this.redditCmd.getSubmissions(reddit, [postID])
            await msg.edit(newEmbed[0])
        })
    }

    /** Add twitter options to a twitter embed */
    public twitterOptions = async (msg: Message) => {
        const reactions = ["reply", "retweet", "twitterheart"]
        for (let i = 0; i < reactions.length; i++) await msg.react(this.discord.getEmoji(reactions[i]))

        const replyCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("reply") && user.bot === false
        const retweetCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("retweet") && user.bot === false
        const heartCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("twitterheart") && user.bot === false

        const reply = msg.createReactionCollector(replyCheck)
        const retweet = msg.createReactionCollector(retweetCheck)
        const heart = msg.createReactionCollector(heartCheck)

        reply.on("collect", async (reaction, user) => {
            await reaction.users.remove(user).catch(() => null)
            const token = await this.sql.fetchColumn("oauth2", "twitter token", "user id", user.id)
            if (!token) {
                const rep = await this.message.channel.send(`<@${user.id}>, you must authenticate your twitter account with **twitteroauth** in order to reply to this tweet.`)
                await rep.delete({timeout: 3000})
                return
            }
            const secret = await this.sql.fetchColumn("oauth2", "twitter secret", "user id", user.id)
            const twitter = new Twitter({
                consumer_key: process.env.TWITTER_API_KEY!,
                consumer_secret: process.env.TWITTER_API_SECRET!,
                access_token_key: token,
                access_token_secret: secret
            })
            let text = ""
            let mediaIDs = ""
            const getReply = async (response: Message) => {
                const images = new Images(this.discord, this.message)
                text = response.content.replace(/(http)(.*?)(?= |$)/g, "").trim()
                response.delete().catch(() => null)
                let links = response.content.trim().match(/(http)(.*?)(?= |$)/)
                if (!links) links = await this.discord.fetchLastAttachment(response, false, /.(png|jpg|gif|mp4)/, 5, true) as any
                if (links) {
                    for (let i = 0; i < links.length; i++) {
                        if (links[0].endsWith(".gif") || links[0].endsWith(".mp4")) {
                            mediaIDs = await images.uploadTwitterMedia(twitter, links[0])
                            break
                        }
                        if (mediaIDs.length === 4) break
                        if (links[i].endsWith(".jpg") || links[i].endsWith(".png")) {
                            const mediaID = await images.uploadTwitterMedia(twitter, links[i])
                            if (i === 0) {
                                mediaIDs += mediaID
                            } else {
                                mediaIDs += `,${mediaID}`
                            }
                        }
                    }
                }
            }
            const rep = await this.message.channel.send(`<@${user.id}>, Enter the reply that you want to leave on this tweet.`)
            await this.embeds.createPrompt(getReply)
            rep.delete()
            const id = msg.embeds[0].url?.match(/(?<=status\/)(.*?)(?=$| )/)?.[0] ?? ""
            const author = msg.embeds[0].description?.match(/(?<=Author:_ \*\*)(.*?)(?=\*\*)/gi)?.[0] ?? ""
            await twitter.post("statuses/update", {
                status: `@${author} ${text}`,
                media_ids: mediaIDs,
                in_reply_to_status_id: id,
                auto_populate_reply_metadata: true
            })
            const rep2 = await msg.channel.send(`<@${user.id}>, Replied to this tweet! ${this.discord.getEmoji("gabYes")}`)
            rep2.delete({timeout: 3000})
        })

        retweet.on("collect", async (reaction, user) => {
            await reaction.users.remove(user).catch(() => null)
            const token = await this.sql.fetchColumn("oauth2", "twitter token", "user id", user.id)
            if (!token) {
                const rep = await this.message.channel.send(`<@${user.id}>, you must authenticate your twitter account with **twitteroauth** in order to reply to this tweet.`)
                await rep.delete({timeout: 3000})
                return
            }
            const secret = await this.sql.fetchColumn("oauth2", "twitter secret", "user id", user.id)
            const twitter = new Twitter({
                consumer_key: process.env.TWITTER_API_KEY!,
                consumer_secret: process.env.TWITTER_API_SECRET!,
                access_token_key: token,
                access_token_secret: secret
            })
            const id = msg.embeds[0].url?.match(/(?<=status\/)(.*?)(?=$| )/)?.[0] ?? ""
            const twitterID = await SQLQuery.fetchColumn("oauth2", "twitter id", "user id", user.id)
            const retweets = await twitter.get(`statuses/retweets/${id}`, {id}).then((r) => r.map((u: any) => u.user.id_str))
            let rep: Message
            if (retweets.includes(twitterID)) {
                rep = await msg.channel.send(`<@${user.id}>, Unretweeted this tweet! ${this.discord.getEmoji("sataniaDead")}`)
                await twitter.post(`statuses/unretweet/${id}`, {id})
            } else {
                rep = await msg.channel.send(`<@${user.id}>, Retweeted this tweet! ${this.discord.getEmoji("aquaUp")}`)
                await twitter.post(`statuses/retweet/${id}`, {id})
            }
            rep.delete({timeout: 3000})
        })

        heart.on("collect", async (reaction, user) => {
            await reaction.users.remove(user).catch(() => null)
            const token = await this.sql.fetchColumn("oauth2", "twitter token", "user id", user.id)
            if (!token) {
                const rep = await this.message.channel.send(`<@${user.id}>, you must authenticate your twitter account with **twitteroauth** in order to reply to this tweet.`)
                await rep.delete({timeout: 3000})
                return
            }
            const secret = await this.sql.fetchColumn("oauth2", "twitter secret", "user id", user.id)
            const twitter = new Twitter({
                consumer_key: process.env.TWITTER_API_KEY!,
                consumer_secret: process.env.TWITTER_API_SECRET!,
                access_token_key: token,
                access_token_secret: secret
            })
            const id = msg.embeds[0].url?.match(/(?<=status\/)(.*?)(?=$| )/)?.[0] ?? ""
            const twitterID = await SQLQuery.fetchColumn("oauth2", "twitter id", "user id", user.id)
            const likes = await twitter.get(`favorites/list`, {user_id: twitterID, max_id: id}).then((r) => r.map((t: any) => t.id_str))
            let rep: Message
            if (likes.includes(id)) {
                rep = await msg.channel.send(`<@${user.id}>, Unliked this tweet! ${this.discord.getEmoji("sagiriBleh")}`)
                await twitter.post(`favorites/destroy`, {id})
            } else {
                rep = await msg.channel.send(`<@${user.id}>, Liked this tweet! ${this.discord.getEmoji("gabYes")}`)
                await twitter.post(`favorites/create`, {id})
            }
            rep.delete({timeout: 3000})
        })
    }
}
