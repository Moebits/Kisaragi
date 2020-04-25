import axios from "axios"
import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Permission} from "../../structures/Permission"
import * as config from "./../../config.json"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class RedditOauth extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Authorize read and write access to your reddit account. **Requires oauth2 and a connection with your reddit account on discord**.",
            help:
            `
            \`redditoauth\` - Follow the url and click on "Authorize" to authorize your reddit account
            \`redditoauth revoke/delete\` - Deletes and revokes your reddit token
            `,
            examples:
            `
            \`=>redditoauth\`
            \`=>redditoauth revoke\`
            `,
            guildOnly: true,
            aliases: ["roauth"],
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        const embeds = new Embeds(discord, message)
        if (args[1] === "delete" || args[1] === "revoke") {
            await SQLQuery.revokeRedditOauth(message.author.id)
            const oauth2Embed = embeds.createEmbed()
            oauth2Embed
            .setAuthor("reddit oauth", "https://toppng.com/uploads/preview/reddit-logo-reddit-icon-115628658968pe8utyxjt.png")
            .setTitle(`**Reddit Oauth2** ${discord.getEmoji("mexShrug")}`)
            .setDescription(`${discord.getEmoji("star")}Revoked your reddit token!`)
            return message.channel.send(oauth2Embed)
        }

        const url = `https://www.reddit.com/api/v1/authorize?client_id=${process.env.REDDIT_APP_ID}&response_type=code&state=${Functions.randomString(16)}&redirect_uri=${config.redditRedirect}&duration=permanent&scope=identity,read,save,subscribe,submit,edit,vote,flair`
        const redditOauthEmbed = embeds.createEmbed()
        redditOauthEmbed
        .setAuthor("reddit oauth", "https://toppng.com/uploads/preview/reddit-logo-reddit-icon-115628658968pe8utyxjt.png")
        .setTitle(`**Reddit Oauth2** ${discord.getEmoji("mexShrug")}`)
        .setDescription(`${discord.getEmoji("star")}Authorize Kisaragi Bot [**here**](${url}) in order to upvote, downvote, and save posts and to subscribe to subreddits.`)
        return message.channel.send(redditOauthEmbed)
    }
}
