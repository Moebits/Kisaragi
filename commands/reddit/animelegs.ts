import {Message} from "discord.js"
import {SlashCommandSubcommand} from "../../structures/SlashCommandOption"
import snoowrap from "snoowrap"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Oauth2} from "./../../structures/Oauth2"
import {Permission} from "./../../structures/Permission"
import Reddit from "./reddit"

export default class Animelegs extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Anime legs.",
            help:
            `
            \`animelegs\` - Gets a random post from r/animelegs
            `,
            examples:
            `
            \`=>animelegs\`
            `,
            aliases: [],
            random: "none",
            cooldown: 10,
            subcommandEnabled: true
        })
        this.subcommand = new SlashCommandSubcommand()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        const redditCmd = new Reddit(discord, message)
        const oauth2 = new Oauth2(discord, message)

        const reddit = new snoowrap({
            userAgent: "kisaragi bot v1.0",
            clientId: process.env.REDDIT_APP_ID,
            clientSecret: process.env.REDDIT_APP_SECRET,
            refreshToken: process.env.REDDIT_REFRESH_TOKEN
        })

        const posts = await reddit.getSubreddit("animelegs").getHot()
        const postIDS: string[] = []
        for (let i = 0; i < posts.length; i++) {
            if (posts[i]) {
                postIDS.push(posts[i].id)
            }
        }
        let redditArray = await redditCmd.getSubmissions(reddit, postIDS, true)
        redditArray = Functions.shuffleArray(redditArray)
        if (!redditArray[0]) return redditCmd.noResults()
        let msg: Message<true>
        if (redditArray.length === 1) {
            msg = await message.channel.send({embeds: [redditArray[0]]})
        } else {
            msg = await embeds.createReactionEmbed(redditArray, true, true)
        }
        await oauth2.redditOptions(msg)
    }
}
