import axios from "axios"
import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class $8chan extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches 8chan.",
            aliases: [],
            cooldown: 3
        })
    }

    public cleanComment = (comment: string) => {
        const clean1 = comment.replace(/<\/?[^>]+(>|$)/g, "")
        const clean2 = clean1.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&")
        return clean2
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const board = args[1]
        const result = await axios.get(`https://8ch.net/${board}/0.json`)
        const random = Math.floor(Math.random() * result.data.threads.length)
        const thread = result.data.threads[random]

        const chanArray: MessageEmbed[] = []
        for (const i in thread.posts) {
            const chanEmbed = embeds.createEmbed()
            const url = `https://8ch.net/${board}/res/${thread.posts[0].no}.html`
            const image = thread.posts[i].filename ? `https://media.8ch.net/file_store/${thread.posts[i].tim}${thread.posts[i].ext}` : "https://8ch.net/index.html"
            const imageInfo = thread.posts[i].filename ? `File: ${thread.posts[i].filename}${thread.posts[i].ext} (${Math.floor(thread.posts[i].fsize / 1024)} KB, ${thread.posts[i].w}x${thread.posts[i].h})` : "None"
            chanEmbed
            .setAuthor("8chan", "https://pbs.twimg.com/profile_images/899238730128539648/J6g3Ws7o_400x400.jpg")
            .setTitle(`**${thread.posts[0].sub}** ${discord.getEmoji("raphi")}`)
            .setURL(url)
            .setImage(image)
            .setDescription(
                `${discord.getEmoji("star")}_Post:_ ${url}#${thread.posts[i].no}\n` +
                `${discord.getEmoji("star")}_Author:_ ${thread.posts[i].name} No. ${thread.posts[i].no}\n` +
                `${discord.getEmoji("star")}_Image Info:_ ${imageInfo}\n` +
                `${discord.getEmoji("star")}_Comment:_ ${this.cleanComment(thread.posts[i].com)}\n`
            )
            chanArray.push(chanEmbed)
        }
        embeds.createReactionEmbed(chanArray)
    }
}
