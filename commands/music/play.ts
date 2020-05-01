import axios from "axios"
import {Collection, Message, MessageEmbed, MessageReaction, StreamDispatcher, User} from "discord.js"
import fs from "fs"
import path from "path"
import {Command} from "../../structures/Command"
import * as defaults from "./../../assets/json/defaultSongs.json"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Play extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Plays any song from soundcloud, youtube, a link, or an attachment.",
            help:
            `
            _Note: You must be in a voice channel._
            \`play\` - Plays the default songs.
            \`play song\` - Searches for songs on soundcloud and plays the one that you pick.
            \`play yt song\` - Searches for songs on youtube and plays the one that you pick.
            \`play first yt? song\` - Plays the first result automatically.
            \`play reverse yt? song\` - Starts playback in reverse mode.
            \`play loop yt? song\` - Starts playback in loop mode.
            \`play sc song\` - You don't need to specify soundcloud, since it's the default.
            `,
            examples:
            `
            \`=>play reverse first synthion comet\`
            \`=>play virtual riot\`
            \`=>play yt tenpi moonlight\`
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
            return message.reply(`You must join a voice channel first. How will you listen to the song ${discord.getEmoji("kannaFacepalm")}`)
        }

        const loading = message.channel.lastMessage

        let queue = audio.getQueue() as any
        let setYT = false
        let song = Functions.combineArgs(args, 1).trim()
        let file: string
        let queueEmbed: MessageEmbed
        let setReverse = false
        let setLoop = false
        if (song.match(/yt/)) {
            setYT = true
            song = song.replace("yt", "")
        } else if (song.match(/sc/)) {
            song = song.replace("sc", "")
        } else if (song?.match(/reverse/)) {
            song = song.replace("reverse", "")
            setReverse = true
        } else if (song?.match(/loop/)) {
            song = song.replace("loop", "")
            setLoop = true
        }
        if (!song) {
            const regex = new RegExp(/.(mp3|wav|flac|ogg|aiff)/)
            const filepath = await discord.fetchLastAttachment(message, false, regex)
            if (!filepath) {
                song = defaults.songs[Math.floor(Math.random()*defaults.songs.length)]
                file = await audio.download(song)
                queueEmbed = await audio.queueAdd(song, file)
            } else {
                file = await audio.download(filepath)
                queueEmbed = await audio.queueAdd(filepath, file)
            }
        } else if (song?.match(/youtube.com|youtu.be/)) {
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
                file = await audio.download(link, song)
                queueEmbed = await audio.queueAdd(link, file)
            }
        }
        await message.channel.send(queueEmbed)
        queue = audio.getQueue() as any
        if (setLoop) queue[0].looping = true
        if (loading) await loading?.delete()
        if (queue.length === 1 && !queue[0].playing) {
            if (setReverse) {
                await audio.reverse(audio.next())
            } else {
                await audio.play(audio.next())
            }
            const nowPlaying = await audio.nowPlaying()
            if (nowPlaying) await message.channel.send(nowPlaying)
        }
    }
}
