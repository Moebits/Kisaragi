import axios from "axios"
import {Message, EmbedBuilder, SlashCommandBuilder, SlashCommandStringOption} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

export default class AnimeBooks extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Anime girls holding programming books.",
            help:
            `
            \`animebooks\` - Get any books
            \`animebooks language\` - Searches for books in the language
            `,
            examples:
            `
            \`=>animebooks\`
            \`=>animebooks javascript\`
            \`=>animebooks c\`
            `,
            aliases: ["books", "animegirlbooks", "animegirlsholdingprogrammingbooks"],
            random: "string",
            cooldown: 10,
            slashEnabled: true
        })
        const languageOption = new SlashCommandStringOption()
            .setName("language")
            .setDescription("Specify a programming language.")

        this.slash = new SlashCommandBuilder()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addStringOption(languageOption)
            .toJSON()
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        if (discord.checkMuted(message)) if (!perms.checkNSFW()) return
        const query = Functions.combineArgs(args, 1).trim().replace(/ +/g, "_")
        const headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}

        const url = `https://anime-girls-holding-programming-books.netlify.com/${query}`
        const html = await axios.get(url, {headers}).then((r) => r.data).catch(() => {
            return message.reply(`Invalid programming language ${discord.getEmoji("kannaFacepalm")}`)
        })
        let pictures = html.match(/(?<=src=")\/static\/(.*?)(?=")/gm)?.map((m) => `https://anime-girls-holding-programming-books.netlify.com${m}`)
        pictures = Functions.shuffleArray(pictures)

        const bookArray: EmbedBuilder[] = []
        for (let i = 0; i < pictures.length; i++) {
            const bookEmbed = embeds.createEmbed()
            bookEmbed
            .setURL(url)
            .setTitle(`**Anime Girls Holding Programming Books** ${discord.getEmoji("kannaCurious")}`)
            .setImage(pictures[i])
            bookArray.push(bookEmbed)
        }

        if (bookArray.length === 1) {
            return message.channel.send({embeds: [bookArray[0]]})
        } else {
            embeds.createReactionEmbed(bookArray, false, true)
        }
    }
}
