import {Collection, Emoji, Message, MessageAttachment, MessageCollector, MessageEmbed, MessageEmbedThumbnail, MessageReaction, ReactionEmoji, User} from "discord.js"
import fs from "fs"
import path from "path"
import snoowrap from "snoowrap"
import RedditCmd from "../commands/website/reddit"
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

        const reddit = new snoowrap({
            userAgent: "kisaragi bot v1.0 by /u/imtenpi",
            clientId: process.env.REDDIT_APP_ID,
            clientSecret: process.env.REDDIT_APP_SECRET,
            refreshToken
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
}
