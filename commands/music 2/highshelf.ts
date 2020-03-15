import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Highshelf extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Applies a highshelf filter to an audio file (boosts treble).",
            help:
            `
            \`highshelf gain? freq? width?\` - Applies a highshelf filter to the audio file with the parameters.
            \`highshelf download/dl gain? freq? width?\` - Applies a highshelf filter to an attachment and uploads it.
            `,
            examples:
            `
            \`=>highshelf 4 3000 100\`
            \`=>highshelf 2 1000 50\`
            `,
            aliases: ["treble"],
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
        const gain = Number(args[1]) ? Number(args[1]) : 3
        const freq = Number(args[2]) ? Number(args[2]) : 1000
        const width = Number(args[3]) ? Number(args[3]) : 100
        const rep = await message.reply("_Adding a highshelf filter to the file, please wait..._")
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
            await audio.highshelf(file, gain, freq, width, setDownload)
        } catch {
            return message.reply("Sorry, these parameters will cause clipping distortion on the audio file.")
        }
        if (rep) rep.delete()
        if (!setDownload) {
            const rep = await message.reply("Added a highshelf filter to the file!")
            rep.delete({timeout: 3000})
        }
        return
    }
}
