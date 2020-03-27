import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Upsample extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Applies upsampling to an audio file.",
            help:
            `
            \`upsample factor?\` - Applies upsampling to the audio file with the parameters.
            \`upsample download/dl factor?\` - Applies upsampling to an attachment and uploads it.
            `,
            examples:
            `
            \`=>upsample 2\`
            \`=>upsample download 4\`
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
        const factor = Number(args[1])
        const rep = await message.reply("_Adding upsampling to the file, please wait..._")
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
            await audio.upsample(file, factor, setDownload)
        } catch {
            return message.reply("Sorry, these parameters will cause clipping distortion on the audio file.")
        }
        if (rep) rep.delete()
        if (!setDownload) {
            const rep = await message.reply("Added upsampling to the file!")
            rep.delete({timeout: 3000})
        }
        return
    }
}
