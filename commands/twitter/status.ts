import {Message} from "discord.js"
import Twitter from "twitter"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Status extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Updates your twitter profile description. **Requires twitteroauth**",
            help:
            `
            \`status content\` - Update your status
            `,
            examples:
            `
            \`=>status Visit my website at www.website.com\`
            `,
            aliases: [],
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const sql = new SQLQuery(message)
        const token = await sql.fetchColumn("oauth2", "twitter token", "user id", message.author.id)
        if (!token) return message.reply(`You need to give me read and writing permissions over your twitter account. See the **twitteroauth** command.`)
        const secret = await sql.fetchColumn("oauth2", "twitter secret", "user id", message.author.id)
        const twitterID = await sql.fetchColumn("oauth2", "twitter id", "user id", message.author.id)

        const twitter = new Twitter({
            consumer_key: process.env.TWITTER_API_KEY!,
            consumer_secret: process.env.TWITTER_API_SECRET!,
            access_token_key: token,
            access_token_secret: secret
        })

        const content = Functions.combineArgs(args, 1).trim()
        if (!content) return message.reply(`What do you want to update your status to ${discord.getEmoji("kannaFacepalm")}`)
        await twitter.post(`account/update_profile`, {description: content})
        return message.reply(`Updated your twitter status! ${discord.getEmoji("aquaUp")}`)
    }
}
