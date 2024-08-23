import {Message, VoiceChannel, ChannelType} from "discord.js"
import {joinVoiceChannel} from "@discordjs/voice"
import {Audio} from "../../structures/Audio"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Kisaragi} from "../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

export default class Connect extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Connects to a voice channel.",
            help:
            `
            \`connect channel/mention/id?\` - Joins the channel you are in, or the channel mentioned.
            `,
            examples:
            `
            \`=>connect\`
            `,
            aliases: ["join"],
            guildOnly: true,
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        if (!message.guild) return

        let voiceChannel = null as unknown as VoiceChannel

        if (message.member?.voice.channel) {
            voiceChannel = message.member.voice.channel as VoiceChannel
        } else if (!message.member?.voice.channel) {
            if (!args[1]) {
                voiceChannel = message.guild?.channels.cache.find((c) => c.type === ChannelType.GuildVoice) as VoiceChannel
                if (!voiceChannel) return message.reply("Could not find a channel to join!")
            } else {
                if (args[1].match(/\d{15,}/)) {
                    voiceChannel = message.guild?.channels.cache.find((c) => c.id === args[1].match(/\d{15,}/)?.[0]) as VoiceChannel
                    if (!voiceChannel) return message.reply("Could not find a channel to join!")
                } else {
                    voiceChannel = message.guild?.channels.cache.find((c) => c.name.toLowerCase().includes(args[1].toLowerCase()) && c.type === ChannelType.GuildVoice) as VoiceChannel
                    if (!voiceChannel) return message.reply("Could not find a channel to join!")
                }
            }

        }
        try {
            joinVoiceChannel({guildId: message.guild.id, channelId: voiceChannel.id, adapterCreator: message.guild.voiceAdapterCreator, selfDeaf: false})
        } catch {
            return message.reply(`This is not a voice channel, or I don't have the **Connect** permission. ${discord.getEmoji("kannaFacepalm")}`)
        }
        return message.channel.send(`Connected to the channel **<#${voiceChannel.id}>**!`)
    }
}
