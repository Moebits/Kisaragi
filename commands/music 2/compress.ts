import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Tremolo extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Applies compression to an audio file (reduces dynamic range).",
            help:
            `
            _Note: This is a simple compression effect, set the amount from 0-100._
            \`compress amount?\` - Applies compression to the audio file with the parameters.
            \`compress download/dl amount?\` - Applies compression to an attachment and uploads it.
            `,
            examples:
            `
            \`=>compress 75\`
            \`=>compress 90\`
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
        const amount = Number(args[1])
        const rep = await message.reply("_Applying compression to the file, please wait..._")
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
            await audio.compression(file, amount, setDownload)
        } catch {
            return message.reply("Sorry, these parameters will cause clipping distortion on the audio file.")
        }
        if (rep) rep.delete()
        if (!setDownload) {
            const rep = await message.reply("Applied compression to the file!")
            rep.delete({timeout: 3000})
        }
        return
    }
}
