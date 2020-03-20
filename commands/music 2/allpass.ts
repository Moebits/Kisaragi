import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class AllPass extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Applies an allpass filter to an audio file.",
            help:
            `
            _Note: Frequency and width are in Hz._
            \`allpass freq? width?\` - Adds an allpass filter with the specified parameters.
            \`allpass download/dl freq? width?\` - Applies the effect to an attachment and uploads it.
            `,
            examples:
            `
            \`=>allpass 600 100\`
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
        let setDownload = false
        if (args[1] === "download" || args[1] === "dl") {
            setDownload = true
            args.shift()
        }
        let freq = parseInt(args[1], 10)
        let width = parseInt(args[2], 10)
        if (!freq) freq = 600
        if (!width) width = 100
        if (Number.isNaN(freq) || Number.isNaN(width)) return message.reply(`The parameters must be numbers ${discord.getEmoji("kannaCurious")}`)
        const rep = await message.reply("_Applying an allpass filter, please wait..._")
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
            await audio.allPass(freq, width, file, setDownload)
        } catch {
            return message.reply("Sorry, these parameters will cause clipping distortion on the audio file.")
        }
        if (rep) rep.delete()
        if (!setDownload) {
            const rep = await message.reply("Applied an allpass filter!")
            rep.delete({timeout: 3000})
        }
        return
    }
}
