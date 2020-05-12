import axios from "axios"
import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Kisaragi} from "../../structures/Kisaragi"
import {Functions} from "./../../structures/Functions"
import {Permission} from "./../../structures/Permission"

export default class $8kun extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches a board on 8kun (8chan).",
            aliases: ["8chan"],
            help:
            `
            _Note: This command is nsfw restricted._
            \`8kun\` - Default board is "animu".
            \`8kun board?\` - Gets threads on the board. (default animu)
            \`8kun board query\` - Gets threads matching the query.
            `,
            examples:
            `
            \`=>8kun animu\`
            `,
            cooldown: 3,
            unlist: true
        })
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
        comment = Functions.cleanHTML(comment)
        if (!comment) return ""
        return `${quote}\`\`\`fix\n${comment}\`\`\``
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        if (!perms.checkNSFW()) return
        let board = args[1]
        if (!board) board = "animu"
        const result = await axios.get(`https://8kun.top/${board}/catalog.json`)
        const random = Math.floor(Math.random() * result.data[0].threads.length)
        const threads = result.data[random].threads

        const chanArray: MessageEmbed[] = []
        for (let i = 0; i < threads.length; i++) {
            const thread = threads[i]
            const chanEmbed = embeds.createEmbed()
            const url = `https://8kun.top/${board}/res/${thread.no}.html`
            const image = thread.filename ? `https://media.8kun.top/file_store/thumb/${thread.tim}${thread.ext}` : "https://8kun.top/index.html"
            const imageInfo = thread.filename ? `File: ${thread.filename}${thread.ext} (${Math.floor(thread.fsize / 1024)} KB, ${thread.w}x${thread.h})` : "None"
            chanEmbed
            .setAuthor("8kun", "https://isitwetyet.com/wp-content/uploads/2019/10/8kun-logo-color.png", "https://8kun.top/index.html")
            .setTitle(`**${thread.sub}** ${discord.getEmoji("raphi")}`)
            .setURL(url)
            .setImage(image)
            .setDescription(
                `${discord.getEmoji("star")}_Post:_ ${url}#${thread.no}\n` +
                `${discord.getEmoji("star")}_Author:_ **${thread.name} No. ${thread.no}**\n` +
                `${discord.getEmoji("star")}_Image Info:_ ${imageInfo}\n` +
                `${discord.getEmoji("star")}_Comment:_ ${thread.com ? this.formatComment(thread.com, `${url}#p${thread.no}`) : "None"}\n`
            )
            chanArray.push(chanEmbed)
        }
        embeds.createReactionEmbed(chanArray)
    }
}
