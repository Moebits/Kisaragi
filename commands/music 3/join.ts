import {Message, VoiceChannel} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Join extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Joins a voice channel.",
            help:
            `
            \`join channel/mention/id?\` - Joins the channel you are in, or the channel mentioned.
            `,
            examples:
            `
            \`=>join\`
            `,
            aliases: ["connect"],
            guildOnly: true,
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)

        let voiceChannel = message.guild?.voice?.channel!

        if (message.member?.voice.channel) {
            voiceChannel = message.member.voice.channel
        } else if (!message.member?.voice.channel) {
            if (!args[1]) {
                voiceChannel = message.guild?.channels.cache.find((c) => c.type === "voice") as VoiceChannel
                if (!voiceChannel) return message.reply("Could not find a channel to join!")
            } else {
                if (args[1].match(/\d{15,}/)) {
                    voiceChannel = message.guild?.channels.cache.find((c) => c.id === args[1].match(/\d{15,}/)?.[0]) as VoiceChannel
                    if (!voiceChannel) return message.reply("Could not find a channel to join!")
                } else {
                    voiceChannel = message.guild?.channels.cache.find((c) => c.name.toLowerCase().includes(args[1].toLowerCase())) as VoiceChannel
                    if (!voiceChannel) return message.reply("Could not find a channel to join!")
                }
            }

        }
        try {
            await voiceChannel.join()
        } catch {
            return message.reply(`This is not a voice channel, or I don't have the **Connect** permission. ${discord.getEmoji("kannaFacepalm")}`)
        }
        return message.channel.send(`Joined the channel **<#${voiceChannel.id}>**!`)
    }
}
