import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Lowpass extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Applies a lowpass filter to an audio file.",
            help:
            `
            \`lowpass freq? width?\` - Applies a lowpass filter to the audio file with the parameters.
            \`lowpass download/dl freq? width?\` - Applies a lowpass filter to an attachment and uploads it.
            `,
            examples:
            `
            \`=>lowpass 2000 50\`
            \`=>lowpass 1000 100\`
            `,
            aliases: ["lowcut"],
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
        const width = Number(args[2])
        const rep = await message.reply("_Adding a lowpass filter to the file, please wait..._")
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
            await audio.lowpass(file, freq, width, setDownload)
        } catch {
            return message.reply("Sorry, these parameters will cause clipping distortion on the audio file.")
        }
        if (rep) rep.delete()
        if (!setDownload) {
            const queue = audio.getQueue() as any
            const settings = audio.getSettings() as any
            settings.filters.push("lowpass")
            const embed = await audio.updateNowPlaying()
            queue[0].message.edit(embed)
            const rep = await message.reply("Applied a lowpass filter to the file!")
            rep.delete({timeout: 3000}).then(() => message.delete().catch(() => null))
        }
        return
    }
}
