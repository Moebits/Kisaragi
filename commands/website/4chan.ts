import axios from "axios"
import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"

const chan = require("4chanapi.js")

const nsfwBoards = ["b", "r9k", "pol", "bant", "soc", "s4s", "s", "hc", "hm", "h",
                    "e", "u", "d", "y", "t", "hr", "gif", "aco", "r"]

export default class $4chan extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches for posts and images on 4chan.",
            help:
            `
            _Note: NSFW boards are restricted to nsfw channels._
            \`4chan images?\` - Default search is "a anime".
            \`4chan board query\` - Searches the specified board with the query.
            \`4chan images board query\` - Similar, but only sends all of the images.
            `,
            examples:
            `
            \`=>4chan\`
            \`=>4chan a kawaii\`
            \`=>4chan images c cute\`
            `,
            aliases: ["4", "4ch"],
            cooldown: 15
        })
    }

    public nsfwBoards = (board: string) => {
        for (let i = 0; i < nsfwBoards.length; i++) {
            if (board === nsfwBoards[i]) {
                return true
            }
        }
        return false
    }

    public formatComment = (comment: string, post: string) => {
        let quote = ""
        if (comment.match(/(?<=<a).*?(?=<\/a>)/g)) {
            comment.replace(/(?<=<a).*?(?=<\/a>)/g, "")
            quote = `\n[>>${post.slice(-9)}](${post})`
        }
        comment = comment
        .replace(/&#039;/g, "'").replace(/<br>/g, "\n")
        .replace(/(?<=<a).*?(?=<\/a>)/g, "")
        .replace(/<a/g, "").replace(/<\/a>/g, "")
        .replace(/<s>/g, "||").replace(/<\/s>/g, "||")
        .replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&")
        .replace(/<span class="quote">/g, "").replace(/<\/span>/g, "\n")
        comment = Functions.checkChar(comment, 1800, ".")
        if (!comment) return ""
        return `${quote}\`\`\`yaml\n${comment}\`\`\``
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}
        const perms = new Permission(discord, message)
        const badChanEmbed = embeds.createEmbed()
        .setAuthor("4chan", "https://seeklogo.com/images/1/4chan-logo-620B8734A9-seeklogo.com.png", "https://www.4chan.org/")
        .setTitle(`**4chan Search** ${discord.getEmoji("vigneDead")}`)

        if (args[1] === "images") {
            let board = args[2]
            let query = Functions.combineArgs(args, 3)
            if (!board) {
                board = "a"
                query = "anime"
            }
            if (!board || !query) {
                return this.noQuery(badChanEmbed, "The first parameter is the board name, the rest is the search query.")
            }
            if (this.nsfwBoards(board)) {
                if (!perms.checkNSFW()) return
            }
            const threads = await chan.threadsWithTopics(board, query.split(","))
            const random = Math.floor(Math.random() * threads.length)
            if (!threads[random]) {
                this.invalidQuery(badChanEmbed, "Try searching for a different tag.")
                return
            }
            const results = await chan.threadMediaLinks(threads[random].url)
            const rawUrl = `https://boards.4channel.org/${board}/thread/${threads[random].url.match(/\d+/g)}`
            const url = rawUrl.replace(/4,/g, "")
            const imageArray: MessageEmbed[] = []
            for (const i in results) {
                const chanEmbed = embeds.createEmbed()
                chanEmbed
                .setAuthor("4chan", "https://seeklogo.com/images/1/4chan-logo-620B8734A9-seeklogo.com.png", "https://www.4chan.org/")
                .setTitle(`**4chan Image Search** ${discord.getEmoji("vigneDead")}`)
                .setURL(url)
                .setImage(results[i])
                imageArray.push(chanEmbed)
            }
            if (imageArray.length === 1) {
                message.channel.send(imageArray[0])
            } else {
                embeds.createReactionEmbed(imageArray, false, true)
            }
            return
        }

        let board = args[1]
        let query = Functions.combineArgs(args, 2)
        if (!board) {
            board = "a"
            query = "anime"
        }
        if (board.match(/boards.4channel.org/)) {
            const b = board.match(/(?<=boards.4channel.org\/)(.*?)(?=\/)/)?.[0]
            const id =  board.match(/\d{5,}/)?.[0]
            const apiURL = `https://a.4cdn.org/${b}/thread/${id}.json`
            const json = await axios.get(apiURL, {headers})
            const posts = json.data.posts
            const url = `https://boards.4channel.org/${b}/thread/${id}`
            const chanArray: MessageEmbed[] = []
            for (const i in posts) {
                const chanEmbed = embeds.createEmbed()
                .setAuthor("4chan", "https://seeklogo.com/images/1/4chan-logo-620B8734A9-seeklogo.com.png", "https://www.4chan.org/")
                chanEmbed
                .setTitle(`${posts[0].sub ? posts[0].sub : `**4chan Search**`} ${discord.getEmoji("vigneDead")}`)
                .setURL(`${url}#p${posts[i].no}`)
                .setImage(posts[i].tim ? `https://i.4cdn.org/${b}/${posts[i].tim}${posts[i].ext}` : url)
                .setDescription(
                    `${discord.getEmoji("star")}_Author:_ **${posts[i].name} ${posts[i].now} No. ${posts[i].no}**\n` +
                    `${discord.getEmoji("star")}_Image Info:_ ${posts[i].tim ? `File: ${posts[i].filename}${posts[i].ext} (${Math.floor(posts[i].fsize/1024)} KB, ${posts[i].w}x${posts[i].h})`: "None"}\n` +
                    `${discord.getEmoji("star")}_Comment:_ ${posts[i].com ? this.formatComment(posts[i].com, `${url}#p${posts[i].no}`) : "None"}\n`
                )
                chanArray.push(chanEmbed)
            }
            if (chanArray.length === 1) {
                message.channel.send(chanArray[0])
            } else {
                embeds.createReactionEmbed(chanArray, false, true)
            }
            return
        }
        if (!board || !query) {
            return this.noQuery(badChanEmbed, "The first parameter is the board name, the rest is the search query. Try looking at the [**4chan Website**](https://www.4chan.org/)")
        }
        if (this.nsfwBoards(board)) {
            if (!perms.checkNSFW()) return
        }

        const threads = await chan.threadsWithTopics(board, query.split(",")).catch((e: Error) => e)
        const random = Math.floor(Math.random() * threads.length)
        if (!threads[random]) {
            this.invalidQuery(badChanEmbed, "Try searching for a different tag.")
            return
        }
        const json = await axios.get(threads[random].url, {headers})
        const posts = json.data.posts
        const rawUrl = `https://boards.4channel.org/${board}/thread/${threads[random].url.match(/\d+/g)}`
        const url = rawUrl.replace(/4,/g, "")
        const chanArray: MessageEmbed[] = []
        for (const i in posts) {
            const chanEmbed = embeds.createEmbed()
            .setAuthor("4chan", "https://seeklogo.com/images/1/4chan-logo-620B8734A9-seeklogo.com.png", "https://www.4chan.org/")
            chanEmbed
            .setTitle(`${posts[0].sub ? posts[0].sub : threads[random].semantic_url} ${discord.getEmoji("vigneDead")}`)
            .setURL(`${url}#p${posts[i].no}`)
            .setImage(posts[i].tim ? `https://i.4cdn.org/${board}/${posts[i].tim}${posts[i].ext}` : url)
            .setDescription(
                `${discord.getEmoji("star")}_Author:_ **${posts[i].name} ${posts[i].now} No. ${posts[i].no}**\n` +
                `${discord.getEmoji("star")}_Image Info:_ ${posts[i].tim ? `File: ${posts[i].filename}${posts[i].ext} (${Math.floor(posts[i].fsize/1024)} KB, ${posts[i].w}x${posts[i].h})`: "None"}\n` +
                `${discord.getEmoji("star")}_Comment:_ ${posts[i].com ? this.formatComment(posts[i].com, `${url}#p${posts[i].no}`) : "None"}\n`
            )
            chanArray.push(chanEmbed)
        }
        if (chanArray.length === 1) {
            message.channel.send(chanArray[0])
        } else {
            embeds.createReactionEmbed(chanArray, false, true)
        }
    }
}
