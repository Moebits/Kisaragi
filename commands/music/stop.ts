import {Message, SlashCommandBuilder} from "discord.js"
import {getVoiceConnection} from "@discordjs/voice"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

export default class Stop extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Stops a music stream and leaves the voice channel.",
            help:
            `
            \`stops\` - Stops playback
            `,
            examples:
            `
            \`=>stop\`
            `,
            aliases: ["disconnect"],
            guildOnly: true,
            cooldown: 5,
            slashEnabled: true
        })
        this.slash = new SlashCommandBuilder()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .toJSON()
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const audio = new Audio(discord, message)
        const perms = new Permission(discord, message)
        if (!message.guild) return

        const connection = getVoiceConnection(message.guild.id)

        if (!connection) return message.reply(`I am not in a voice channel ${discord.getEmoji("kannaFacepalm")}`)
        const memberVoice = message.member?.voice?.channel
        if (connection.joinConfig.channelId === memberVoice?.id) {
            audio.deleteQueue()
            connection?.disconnect()
            connection?.destroy()
            return message.channel.send(`Left the voice channel and stopped playback.`)
        } else {
            return message.reply(`You are not in same voice channel as me..? ${discord.getEmoji("confusedAnime")}`)
        }
    }
}
