import axios from "axios"
import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

export default class Trace extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches for the exact scene of an anime picture using trace.moe.",
            help:
            `
            \`trace url?\` - Searches the last posted image, or the image from the url
            `,
            examples:
            `
            \`=>trace\`
            `,
            aliases: ["animescene"],
            random: "string",
            cooldown: 10
        })
    }

    public getSeason = (season: string) => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        const args = season.split("-")
        return `${months[Number(args[1]) - 1]} ${args[0]}`
    }

    public getTime = (time: number) => {
        return `${(time/60).toFixed(2)}`.replace(".", ":")
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        let url = Functions.combineArgs(args, 1)
        if (!url) url = await discord.fetchLastAttachment(message, false, /.(png|jpg)/) as string
        if (!url) return message.reply(`What image do you want to trace ${discord.getEmoji("kannaFacepalm")}`)
        const headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"}

        const json = await axios.get(`https://trace.moe/api/search?url=${url}`, {headers}).then((r) => r.data)
        if (!json?.docs) return message.reply(`No search results found ${discord.getEmoji("aquaCry")}`)

        const traceArray: MessageEmbed[] = []
        for (let i = 0; i < json.docs.length; i++) {
            const trace = json.docs[i]
            if (trace.is_adult) {
                if (!perms.checkNSFW(true)) continue
            }
            const image = `https://trace.moe/thumbnail.php?anilist_id=${trace.anilist_id}&file=${encodeURIComponent(trace.filename)}&t=${trace.at}&token=${trace.tokenthumb}`
            const videoAround = `https://trace.moe/preview.php?anilist_id=${trace.anilist_id}&file=${encodeURIComponent(trace.filename)}&t=${trace.at}&token=${trace.tokenthumb}`
            const video = `https://media.trace.moe/video/${trace.anilist_id}/${encodeURIComponent(trace.filename)}?t=${trace.at}&token=${trace.tokenthumb}`
            const videoMuted = `https://media.trace.moe/video/${trace.anilist_id}/${encodeURIComponent(trace.filename)}?t=${trace.at}&token=${trace.tokenthumb}&mute`
            const traceEmbed = embeds.createEmbed()
            traceEmbed
            .setURL(video)
            .setAuthor("trace.moe", "https://trace.moe/favicon128.png", "https://trace.moe/")
            .setTitle(`Anime Scene Search ${discord.getEmoji("vigneXD")}`)
            .setImage(image)
            .setDescription(
                `${discord.getEmoji("star")}_Anime:_ **${trace.title_english}**\n` +
                `${discord.getEmoji("star")}_Japanese Title:_ **${trace.title_native}**\n` +
                `${discord.getEmoji("star")}_Season:_ **${this.getSeason(trace.season)}**\n` +
                `${discord.getEmoji("star")}_Episode:_ **${trace.episode}**\n` +
                `${discord.getEmoji("star")}_Similarity:_ **${(trace.similarity * 100).toFixed(2)}%**\n` +
                `${discord.getEmoji("star")}_Time:_ \`${this.getTime(trace.at)}\`\n` +
                `${discord.getEmoji("star")}_Scene:_ \`${this.getTime(trace.from)} - ${this.getTime(trace.to)}\`\n` +
                `[**Video**](${video})\n` +
                `[**Video Muted**](${videoMuted})\n` +
                `[**Video Around**](${videoAround})\n` +
                `[**AniList**](https://anilist.co/anime/${trace.anilist_id})\n` +
                `[**MyAnimeList**](https://myanimelist.net/anime/${trace.mal_id})\n`
            )
            traceArray.push(traceEmbed)
        }

        if (!traceArray[0]) {
            return this.invalidQuery(embeds.createEmbed()
            .setAuthor("trace.moe", "https://trace.moe/favicon128.png", "https://trace.moe/")
            .setTitle(`Anime Scene Search ${discord.getEmoji("vigneXD")}`), "If this is a hentai, try searching in a NSFW channel.")
        }
        if (traceArray.length === 1) {
            return message.channel.send(traceArray[0])
        } else {
            embeds.createReactionEmbed(traceArray, true, true)
        }
    }
}
