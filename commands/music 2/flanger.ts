import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Flanger extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Applies a flanger effect to an audio file.",
            help:
            `
            _Note: Parameters are delay (0-30), depth (0-10), regen (-95-95), width (0-100), speed (0.1-10), shape (sin/tri), phase (0-100), and interp (lin/quad)._
            \`flanger delay? depth? regen? width? speed? shape? phase? interp?\` - Applies flanger to the audio file with the parameters.
            \`flanger download/dl delay? depth? regen? width? speed? shape? phase? interp?\` - Applies flanger to an attachment and uploads it.
            `,
            examples:
            `
            \`=>flanger 100 30 40 60 30 10 30 20\`
            \`=>flanger download 300 20 40 60 10 50 10 50\`
            `,
            aliases: ["flg"],
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
        const delay = Number(args[1])
        const depth = Number(args[2])
        const regen = Number(args[3])
        const width = Number(args[4])
        const speed = Number(args[5])
        const shape = args[6] as any
        const phase = Number(args[7])
        const interp = args[8] as any
        const rep = await message.reply("_Adding flanger to the file, please wait..._")
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
            await audio.flanger(file, delay, depth, regen, width, speed, shape, phase, interp, setDownload)
        } catch {
            return message.reply("Sorry, these parameters will cause clipping distortion on the audio file.")
        }
        if (rep) rep.delete()
        if (!setDownload) {
            const rep = await message.reply("Added flanger to the file!")
            rep.delete({timeout: 3000})
        }
        return
    }
}
