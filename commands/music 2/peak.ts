import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Peak extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Applies a peak filter to an audio file.",
            help:
            `
            \`peak freq? resonance? gain?\` - Applies a peak filter to the audio file with the parameters.
            \`peak download/dl freq? resonance? gain?\` - Applies a peak filter to an attachment and uploads it.
            `,
            examples:
            `
            \`=>peak 1000 1 3\`
            \`=>peak 3000 2 -4\`
            `,
            aliases: [],
            guildOnly: true,
            cooldown: 20
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const audio = new Audio(discord, message)
        const queue = audio.getQueue() as any
        let setDownload = false
        if (args[1] === "download" || args[1] === "dl") {
            setDownload = true
            args.shift()
        }
        const freq = Number(args[1])
        const resonance = Number(args[2])
        const gain = Number(args[3])
        const rep = await message.reply("_Adding a peak filter to the file, please wait..._")
        let file = ""
        if (setDownload) {
            const regex = new RegExp(/.(mp3|wav|flac|ogg|aiff)/)
            const attachment = await discord.fetchLastAttachment(message, false, regex)
            if (!attachment) return message.reply(`Only **mp3**, **wav**, **flac**, **ogg**, and **aiff** files are supported.`)
            file = attachment
        } else {
            const queue = audio.getQueue() as any
            file = queue?.[0].file
        }
        try {
            await audio.peak(file, freq, resonance, gain, setDownload)
        } catch {
            return message.reply("Sorry, these parameters will cause clipping distortion on the audio file.")
        }
        if (rep) rep.delete()
        if (!setDownload) {
            const queue = audio.getQueue() as any
            const settings = audio.getSettings() as any
            settings.filters.push("peak")
            const embed = await audio.updateNowPlaying()
            queue[0].message.edit(embed)
            const rep = await message.reply("Applied a peak filter to the file!")
            rep.delete({timeout: 3000}).then(() => message.delete().catch(() => null))
        }
        return
    }
}
