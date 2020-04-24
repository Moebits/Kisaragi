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
            const voice = await sql.fetchColumn("config", "voice")
            if (!voice || voice === "off") return
            connection.play(Functions.silence(), {type: "opus"})
            const recording = connection.receiver.createStream(member.id, {mode: "pcm", end: "silence"})
            const pcm = path.join(__dirname, `../../assets/misc/tracks/${member.user.tag}_voice.pcm`)
            await new Promise((resolve) => {
                recording.pipe(fs.createWriteStream(pcm)).on("finish", () => resolve())
            })
            const stream = fs.createReadStream(pcm)
            const contentType = `audio/raw;encoding=signed-integer;bits=16;rate=48000;endian=little`
            const headers = {"authorization": `Bearer ${process.env.WITAI_API_KEY}`, "content-type": contentType, "transfer-encoding": "chunked"}
            const speech = await axios.post(`https://api.wit.ai/speech`, {stream}, {headers}).then((r) => r.data)
            console.log(speech)
        }

        if (connection) voiceRecognition(connection)
    }
}
