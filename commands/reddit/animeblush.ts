import {Message, MessageEmbed} from "discord.js"
import snoowrap from "snoowrap"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import Reddit from "../website/reddit"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"

export default class Animeblush extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Adorable blushing.",
            help:
            `
            \`animeblush\` - Gets a random post from r/animeblush
            `,
            examples:
            `
            \`=>animeblush\`
            `,
            aliases: [],
            random: "none",
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        const redditCmd = new Reddit(discord, message)

        const reddit = new snoowrap({
            userAgent: "kisaragi bot v1.0 by /u/imtenpi",
            clientId: process.env.REDDIT_APP_ID,
            clientSecret: process.env.REDDIT_APP_SECRET,
            username: process.env.REDDIT_USERNAME,
            password: process.env.REDDIT_PASSWORD
        })

        const posts = await reddit.getSubreddit("animeblush").getHot()
        const postIDS: string[] = []
        for (let i = 0; i < posts.length; i++) {
            if (posts[i]) {
                postIDS.push(posts[i].id)
            }
        }
        let redditArray = await redditCmd.getSubmissions(discord, reddit, embeds, postIDS, true)
        redditArray = Functions.shuffleArray(redditArray)
        if (!redditArray[0]) return redditCmd.noResults()
        if (redditArray.length === 1) {
            message.channel.send(redditArray[0])
        } else {
            embeds.createReactionEmbed(redditArray, true, true)
        }
    }
}
