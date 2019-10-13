import axios from "axios"
import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

const GitHub = require("github-api")

export default class Github extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches github.",
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const github = new GitHub({
            token: process.env.GITHUB_ACCESS_TOKEN
        })

        if (args[1].toLowerCase() === "user") {
            const input = Functions.combineArgs(args, 2)
            const user = github.getUser(input.trim())
            const json = await user.getProfile()
            const result = json.data
            const githubEmbed = embeds.createEmbed()
            githubEmbed
            .setAuthor("github", "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png")
            .setTitle(`**Github Search** ${discord.getEmoji("raphi")}`)
            .setURL(result.html_url)
            .setDescription(
                `${discord.getEmoji("star")}_Name:_ **${result.login}**\n` +
                `${discord.getEmoji("star")}_Link:_ **${result.html_url}**\n` +
                `${discord.getEmoji("star")}_Creation Date:_ **${Functions.formatDate(result.created_at)}**\n` +
                `${discord.getEmoji("star")}_Updated:_ **${Functions.formatDate(result.updated_at)}**\n` +
                `${discord.getEmoji("star")}_Location:_ **${result.location}**\n` +
                `${discord.getEmoji("star")}_Repositories:_ **${result.public_repos}**\n` +
                `${discord.getEmoji("star")}_Followers:_ **${result.followers}**\n` +
                `${discord.getEmoji("star")}_Following:_ **${result.following}**\n` +
                `${discord.getEmoji("star")}_Email:_ **${result.email ? result.email : "None"}**\n` +
                `${discord.getEmoji("star")}_Bio:_ ${result.bio}\n`
            )
            .setThumbnail(result.avatar_url)
            message.channel.send(githubEmbed)
            return
        }

        const input = Functions.combineArgs(args, 1)
        const search = github.search({q: input.trim()})
        const json = await search.forRepositories()
        const result = json.data
        const githubArray: MessageEmbed[] = []
        for (let i = 0; i < 10; i++) {
            const source = await axios.get(result[i].html_url)
            const regex = /<meta[^>]+name="twitter:image:src"[^>]+content="?([^"\s]+)"?\s*\/>/g
            const urls: string[] = []
            const m = regex.exec(source.data)
            if (m !== null) {
                for (let i = 0; i < m.length; i++) {
                    urls.push(m[i])
                }
            }
            const githubEmbed = embeds.createEmbed()
            githubEmbed
            .setAuthor("github", "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png")
            .setTitle(`**Github Search** ${discord.getEmoji("raphi")}`)
            .setURL(result[i].html_url)
            .setDescription(
                `${discord.getEmoji("star")}_Name:_ **${result[i].name}**\n` +
                `${discord.getEmoji("star")}_Author:_ **${result[i].owner.login}**\n` +
                `${discord.getEmoji("star")}_Link:_ **${result[i].html_url}**\n` +
                `${discord.getEmoji("star")}_Language:_ **${result[i].language}**\n` +
                `${discord.getEmoji("star")}_Stargazers:_ **${result[i].stargazers_count}**\n` +
                `${discord.getEmoji("star")}_Forks:_ **${result[i].forks_count}**\n` +
                `${discord.getEmoji("star")}_Open Issues:_ **${result[i].open_issues}**\n` +
                `${discord.getEmoji("star")}_Watchers:_ **${result[i].watchers_count}**\n` +
                `${discord.getEmoji("star")}_Creation Date:_ **${Functions.formatDate(result[i].created_at)}**\n` +
                `${discord.getEmoji("star")}_Updated:_ **${Functions.formatDate(result[i].updated_at)}**\n` +
                `${discord.getEmoji("star")}_Description:_ ${result[i].description}\n`
            )
            .setThumbnail(result[i].owner.avatar_url)
            .setImage(urls[0])
            githubArray.push(githubEmbed)
        }
        embeds.createReactionEmbed(githubArray)
    }
}
