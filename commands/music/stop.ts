import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Stop extends Command {
    constructor(discord: Kisaragi, message: Message) {
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
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const audio = new Audio(discord, message)

        const voiceChannel = message.guild?.voice?.channel
        if (!voiceChannel) return message.reply(`I am not in a voice channel ${discord.getEmoji("kannaCurious")}`)
        const memberVoice = message.member?.voice?.channel
        if (voiceChannel.id === memberVoice?.id) {
            audio.deleteQueue()
            voiceChannel.leave()
            return message.channel.send(`Left the voice channel and stopped playback.`)
        } else {
            return message.reply(`You are not in same voice channel as me..? ${discord.getEmoji("confusedAnime")}`)
        }
    }
}
