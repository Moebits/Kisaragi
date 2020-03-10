import {Collection, Message, MessageEmbed, MessageReaction, StreamDispatcher, User} from "discord.js"
import {Command} from "../../structures/Command"
import * as defaults from "./../../assets/json/defaultSongs.json"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Play extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Plays any song on soundcloud, youtube, or from a link.",
            help:
            `
            _Note: You must be in a voice channel._
            \`play\` - Plays the default songs.
            \`play song\` - Searches for songs on soundcloud and plays the one that you pick.
            \`play yt song\` - Searches for songs on youtube and plays the one that you pick.
            \`play first yt? song\` - Plays the first result automatically.
            `,
            examples:
            `
            \`=>play\`
            \`=>play virtual riot\`
            \`=>play tenpi snowflake\`
            `,
            guildOnly: true,
            aliases: ["stream"],
            cooldown: 30
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const audio = new Audio(discord, message)

        let voiceChannel = message.guild?.voice?.channel!
        let connection = message.guild?.voice?.connection!

        if (!connection && message.member?.voice.channel) {
            voiceChannel = message.member.voice.channel
            connection = await message.member.voice.channel.join()
        } else if (!message.member?.voice.channel) {
            return message.reply(`You must join a voice channel first. How are you going to listen to the song ${discord.getEmoji("kannaCurious")}`)
        }

        const loading = message.channel.lastMessage
        loading?.delete()

        let queue = audio.getQueue() as any
        let setYT = false
        let song: string
        if (args[1] === "yt") {
            song = Functions.combineArgs(args, 2).trim()
            setYT = true
        } else {
            song = Functions.combineArgs(args, 1).trim()
        }
        if (!song) song = defaults.songs[Math.floor(Math.random()*defaults.songs.length)]

        let queueEmbed: MessageEmbed
        let file: string
        if (song?.match(/youtube.com|youtu.be/)) {
            file = await audio.download(song)
            queueEmbed = await audio.queueAdd(song, file)
        } else if (song?.match(/soundcloud.com/)) {
            file = await audio.download(song)
            queueEmbed = await audio.queueAdd(song, file)
        } else if (song?.match(/.(mp3|wav|ogg|webm)/) || song?.includes("http")) {
                file = await audio.download(song)
                queueEmbed = await audio.queueAdd(song, file)
        } else {
            let setFirst = false
            if (song?.match(/first/)) {
                song = song.replace("first", "")
                setFirst = true
            }
            if (setYT) {
                const link = await audio.songPickerYT(song, setFirst)
                if (!link) return message.reply("No results were found for your query!")
                song = link
                file = await audio.download(link)
                queueEmbed = await audio.queueAdd(link, file)
            } else {
                const link = await audio.songPickerSC(song, setFirst)
                if (!link) return message.reply("No results were found for your query!")
                song = link
                file = await audio.download(link)
                queueEmbed = await audio.queueAdd(link, file)
            }
        }
        queue = audio.getQueue() as any
        await message.channel.send(queueEmbed)
        if (queue.length === 1 && !queue[0].playing) {
            await audio.play(audio.next())
            const nowPlaying = await audio.nowPlaying()
            if (nowPlaying) await message.channel.send(nowPlaying)
        }
    }
}
