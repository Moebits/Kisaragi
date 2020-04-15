import axios from "axios"
import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"

export default class Books extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Anime girls holding programming books.",
            help:
            `
            \`books language\` - Searches for an anime with the query.
            `,
            examples:
            `
            \`=>books\`
            \`=>books javascript\`
            \`=>books c\`
            `,
            aliases: ["book", "programmingbooks", "animegirlbooks", "animegirlsholdingbooks", "animegirlsholdingprogrammingbooks"],
            random: "string",
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const query = Functions.combineArgs(args, 1).trim().replace(/ +/g, "_")
        const headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}

        const url = `https://anime-girls-holding-programming-books.netlify.com/${query}`
        const html = await axios.get(url, {headers}).then((r) => r.data).catch(() => {
            return message.reply(`Invalid programming language ${discord.getEmoji("kannaFacepalm")}`)
        })
        let pictures = html.match(/(?<=src=")\/static\/(.*?)(?=")/gm)?.map((m) => `https://anime-girls-holding-programming-books.netlify.com${m}`)
        pictures = Functions.shuffleArray(pictures)

        const bookArray: MessageEmbed[] = []
        for (let i = 0; i < pictures.length; i++) {
            const bookEmbed = embeds.createEmbed()
            bookEmbed
            .setURL(url)
            .setTitle(`**Anime Girls Holding Programming Books** ${discord.getEmoji("kannaCurious")}`)
            .setImage(pictures[i])
            bookArray.push(bookEmbed)
        }

        if (bookArray.length === 1) {
            return message.channel.send(bookArray[0])
        } else {
            embeds.createReactionEmbed(bookArray, false, true)
        }
    }
}
