import {Message, AttachmentBuilder, TextChannel} from "discord.js"
import {getVoiceConnection, joinVoiceChannel, EndBehaviorType} from "@discordjs/voice"
import fs from "fs"
import path from "path"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {AudioEffects} from "./../../structures/AudioEffects"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Images} from "./../../structures/Images"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

export default class Record extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Records your voice and uploads the recording.",
            help:
            `
            _Note: Recording is stopped when there is no more voice activity._
            \`record name?\` - Starts recording, the name is the filename.
            `,
            examples:
            `
            \`=>record\`
            `,
            aliases: [],
            guildOnly: true,
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const audio = new Audio(discord, message)
        const fx = new AudioEffects(discord, message)
        const images = new Images(discord, message)
        const perms = new Permission(discord, message)
        if (!message.guild) return
        const name = Functions.combineArgs(args, 1) ? Functions.combineArgs(args, 1) : message.author.username
        if (!(message.channel as TextChannel).permissionsFor(message.guild?.members.me!)?.has(["Connect", "Speak"])) {
            await message.channel.send(`The bot needs the permissions **Connect** and **Speak** in order to use this command. ${this.discord.getEmoji("kannaFacepalm")}`)
            return
        }

        let voiceChannel = message.member?.voice.channel
        let connection = getVoiceConnection(message.guild.id)!

        if (!connection && voiceChannel) {
            connection = joinVoiceChannel({channelId: voiceChannel.id, guildId: message.guild.id, adapterCreator: message.guild.voiceAdapterCreator, selfDeaf: false})
        } else if (!message.member?.voice.channel) {
            return message.reply(`You must join a voice channel first. What am I going to record ${discord.getEmoji("kannaFacepalm")}`)
        }
        const loading = message.channel.lastMessage
        loading?.delete()
        const recording = connection.receiver.subscribe(message.author.id, {end: {behavior: EndBehaviorType.AfterSilence, duration: 1000}})
        const pcm = path.join(__dirname, `../../assets/misc/tracks/${name}.pcm`)
        await message.channel.send(`Recording started! Please use **push to talk**, the recording will stop once the push button is released.`)
        await new Promise<void>((resolve) => {
            recording.pipe(fs.createWriteStream(pcm) as unknown as NodeJS.WritableStream).on("finish", () => resolve())
        })
        let mp3Dest: string
        try {
            mp3Dest = await fx.convertToFormat(pcm, "mp3")
        } catch {
            return message.reply(`Nothing was recorded ${discord.getEmoji("kannaFacepalm")}`)
        }
        const stats = fs.statSync(mp3Dest)

        if (stats.size > 8000000) {
            const link = await images.upload(mp3Dest)
            const recordingEmbed = embeds.createEmbed()
            recordingEmbed
            .setAuthor({name: "recording", iconURL: "https://previews.123rf.com/images/aayam4d/aayam4d1907/aayam4d190701016/127713669-record-button-icon-audio-video-recording-start-button-vector-art-illustration.jpg"})
            .setTitle(`**Voice Recording** ${discord.getEmoji("chinoSmug")}`)
            .setDescription(
                `${discord.getEmoji("star")}Recorded your voice! This file is too large for attachments, download it [**here**](${link}).`
            )
            await message.channel.send({embeds: [recordingEmbed]})
        } else {
            const attachment = new AttachmentBuilder(mp3Dest)
            const recordingEmbed = embeds.createEmbed()
            recordingEmbed
            .setAuthor({name: "recording", iconURL: "https://previews.123rf.com/images/aayam4d/aayam4d1907/aayam4d190701016/127713669-record-button-icon-audio-video-recording-start-button-vector-art-illustration.jpg"})
            .setTitle(`**Voice Recording** ${discord.getEmoji("chinoSmug")}`)
            .setDescription(
                `${discord.getEmoji("star")}Here is your voice recording!`
            )
            await message.channel.send({embeds: [recordingEmbed]})
            await message.channel.send({files: [attachment]})
        }
        return
    }
}
