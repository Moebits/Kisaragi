import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Reverb extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Applies a reverb effect to an audio file.",
            help:
            `
            _Note: The first four parameters are percentages, pre-delay is in milliseconds and gain is in decibels._
            \`reverb amount? damping? room? stereo? pre-delay? wet-gain?\` - Applies a reverb with the specified parameters.
            \`reverb reverse amount? damping? room? stereo? pre-delay? wet-gain?\` - Applies a reverse reverb effect.
            \`reverb download/dl reverse? amount? damping? room? stereo? pre-delay? wet-gain?\` - Applies the effect to an attachment and uploads it.
            `,
            examples:
            `
            \`=>reverb 50 50 100 100 0 0\`
            \`=>reverb reverse 75 25 100 100 0 0\`
            `,
            aliases: [],
            guildOnly: true,
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const audio = new Audio(discord, message)
        let input = Functions.combineArgs(args, 1)
        let setReverse = false
        if (input.match(/reverse/)) {
            setReverse = true
            input = input.replace("reverse", "")
        }
        const newArgs = input.split(/ +/g)
        let setDownload = false
        if (newArgs[0] === "download" || newArgs[0] === "dl") {
            setDownload = true
            args.shift()
        }
        const amount = Number(newArgs[0])
        const damping = Number(newArgs[1])
        const room = Number(newArgs[2])
        const stereo = Number(newArgs[3])
        const preDelay = Number(newArgs[4])
        const wetGain = Number(newArgs[5])
        const rep = await message.reply("_Adding reverb to the file, please wait..._")
        let file = ""
        if (setDownload) {
            const regex = new RegExp(/.(mp3|wav|flac|ogg|aiff)/)
            const attachment = await discord.fetchLastAttachment(message, false, regex)
            if (!attachment) return message.reply(`Only **mp3**, **wav**, **flac**, **ogg**, and **aiff** files are supported.`)
            file = attachment
        } else {
            const queue = audio.getQueue() as any
            file = queue[0]?.file
        }
        try {
            await audio.reverb(file, amount, damping, room, stereo, preDelay, wetGain, setReverse)
        } catch {
            return message.reply("Sorry, these parameters will cause clipping distortion on the audio file.")
        }
        if (rep) rep.delete()
        if (!setDownload) {
            const queue = audio.getQueue() as any
            const settings = audio.getSettings() as any
            settings.effects.push("reverb")
            const embed = await audio.updateNowPlaying()
            queue[0].message.edit(embed)
            const rep = await message.reply("Added a reverb effect to the file!")
            rep.delete({timeout: 3000}).then(() => message.delete().catch(() => null))
        }
        return
    }
}
