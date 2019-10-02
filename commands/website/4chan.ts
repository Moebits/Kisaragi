import * as chan from "4chanapi.js"
import axios from "axios"
import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class $4chan extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public chanError = (discord, message, embeds) => {
        const chanEmbed = embeds.createEmbed()
        chanEmbed
        .setAuthor("4chan", "https://seeklogo.com/images/1/4chan-logo-620B8734A9-seeklogo.com.png")
        .setTitle(`**4chan Search** ${discord.getEmoji("vigneDead")}`)
        .setDescription("No results were found. Try searching for a different tag.")
        message.channel.send(chanEmbed)
    }

    public formatComment = (comment: string, post: string) => {
        const clean1 = comment.replace(/&#039;/g, "'").replace(/<br>/g, "\n")
        const clean2 = clean1.replace(/(?<=<a).*?(?=<\/a>)/g, `[>>${post.slice(-9)}](${post})`)
        const clean3 = clean2.replace(/<a/g, "").replace(/<\/a>/g, "")
        const clean4 = clean3.replace(/<s>/g, "||").replace(/<\/s>/g, "||")
        const clean5 = clean4.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&")
        const clean6 = clean5.replace(/<span class="quote">/g, "").replace(/<\/span>/g, "\n")
        const clean7 = Functions.checkChar(clean6, 1800, ".")
        return clean7
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)

        if (args[1] === "images") {
            const board = args[2]
            const query = Functions.combineArgs(args, 3)
            const threads = await chan.threadsWithTopics(board, query.split(","))
            const random = Math.floor(Math.random() * threads.length)
            if (!threads[random]) {
                this.chanError(discord, message, embeds)
                return
            }
            const results = await chan.threadMediaLinks(threads[random].url)
            const rawUrl = `https://boards.4channel.org/${board}/thread/${threads[random].url.match(/\d+/g)}`
            const url = rawUrl.replace(/4,/g, "")
            const imageArray: any = []
            for (const i in results) {
                const chanEmbed = embeds.createEmbed()
                chanEmbed
                .setAuthor("4chan", "https://seeklogo.com/images/1/4chan-logo-620B8734A9-seeklogo.com.png")
                .setTitle(`**4chan Search** ${discord.getEmoji("vigneDead")}`)
                .setURL(url)
                .setImage(results[i])
                imageArray.push(chanEmbed)
            }
            if (imageArray.length === 1) {
                message.channel.send(imageArray[0])
            } else {
                embeds.createReactionEmbed(imageArray)
            }
            return
        }

        const board = args[1]
        const query = Functions.combineArgs(args, 2)

        const threads = await chan.threadsWithTopics(board, query.split(","))
        const random = Math.floor(Math.random() * threads.length)
        if (!threads[random]) {
            this.chanError(discord, message, embeds)
            return
        }
        const json = await axios.get(threads[random].url)
        const posts = json.data.posts
        const rawUrl = `https://boards.4channel.org/${board}/thread/${threads[random].url.match(/\d+/g)}`
        const url = rawUrl.replace(/4,/g, "")
        const chanArray: any = []
        for (const i in posts) {
            const chanEmbed = embeds.createEmbed()
            chanEmbed
            .setAuthor("4chan", "https://seeklogo.com/images/1/4chan-logo-620B8734A9-seeklogo.com.png")
            .setTitle(`${posts[0].sub ? posts[0].sub : threads[random].semantic_url} ${discord.getEmoji("vigneDead")}`)
            .setURL(url)
            .setImage(posts[i].tim ? `https://i.4cdn.org/${board}/${posts[i].tim}${posts[i].ext}` : url)
            .setDescription(
                `${discord.getEmoji("star")}_Post:_ **${url}#p${posts[i].no}**\n` +
                `${discord.getEmoji("star")}_Unique IPs:_ **${posts[0].unique_ips}**\n` +
                `${discord.getEmoji("star")}_Author:_ **${posts[i].name} ${posts[i].now} No. ${posts[i].no}**\n` +
                `${discord.getEmoji("star")}_Image Info:_ ${posts[i].tim ? `File: ${posts[i].filename}${posts[i].ext} (${Math.floor(posts[i].fsize/1024)} KB, ${posts[i].w}x${posts[i].h})`: "None"}\n` +
                `${discord.getEmoji("star")}_Comment:_ ${posts[i].com ? this.formatComment(posts[i].com, `${url}#p${posts[i].no}`) : "None"}\n`
            )
            chanArray.push(chanEmbed)
        }
        if (chanArray.length === 1) {
            message.channel.send(chanArray[0])
        } else {
            embeds.createReactionEmbed(chanArray)
        }
    }
}
