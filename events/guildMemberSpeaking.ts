import axios from "axios"
import {GuildMember, Message, Speaking, TextChannel, VoiceConnection} from "discord.js"
import fs from "fs"
import path from "path"
import * as config from "../config.json"
import {AudioEffects} from "./../structures/AudioEffects"
import {CommandFunctions} from "./../structures/CommandFunctions"
import {Embeds} from "./../structures/Embeds"
import {Functions} from "./../structures/Functions"
import {Kisaragi} from "./../structures/Kisaragi"
import {SQLQuery} from "./../structures/SQLQuery"

const cooldowns = new Set()
const cooldownWarning = new Set()

export default class GuildMemberSpeaking {
    constructor(private readonly discord: Kisaragi) {}

    public run = async (member: GuildMember, bits: Readonly<Speaking>) => {
        const discord = this.discord
        const message = member.lastMessage ? member.lastMessage : await discord.fetchFirstMessage(member.guild)
        if (!message) return
        const sql = new SQLQuery(message)
        const fx = new AudioEffects(discord, message)
        const cmd = new CommandFunctions(discord, message)

        let speaking = false
        if (bits.bitfield === 1) speaking = true
        const connection = member.guild.voice?.connection

        const voiceRecognition = async (connection: VoiceConnection) => {
            if (!speaking) return
            const voice = await sql.fetchColumn("guilds", "voice")
            if (!voice || voice === "off") return
            if (cooldowns.has(member.id)) {
                if (cooldownWarning.has(member.id)) return
                cooldownWarning.add(member.id)
                return message.reply(`Voice recognition has a **10** second cooldown ${discord.getEmoji("no")}`)
            }
            const recording = connection.receiver.createStream(member.id, {mode: "pcm", end: "silence"})
            const pcm = path.join(__dirname, `../assets/misc/tracks/${member.user.tag}_voice.pcm`)
            await new Promise<void>((resolve) => {
                recording.pipe(fs.createWriteStream(pcm)).on("finish", () => resolve())
            })
            let wavDest = await fx.pcmToWav(pcm, true)
            wavDest = path.join(__dirname, `.${wavDest}`)
            // const wavDest = path.join(__dirname, "../assets/misc/tracks/hello.wav")
            const buffer = fs.readFileSync(wavDest, null)
            const headers = {"authorization": `Bearer ${process.env.WITAI_API_KEY}`, "content-type": "audio/wav"}
            const speech = await axios.post(`https://api.wit.ai/speech`, buffer, {headers}).then((r) => r.data._text)
            if (!speech.trim()) return
            await message.channel.send(`Voice input: **${speech}**`)
            const args = speech.split(" ")
            await cmd.runCommand(message, args, true)
            cooldowns.add(member.id)
            cooldownWarning.delete(member.id)
            setTimeout(() => {cooldowns.delete(member.id)}, 10000)
        }

        if (connection) voiceRecognition(connection)
    }
}
