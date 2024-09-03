import {Message, SlashCommandBuilder, SlashCommandStringOption} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

export default class Peak extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
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
            cooldown: 20,
            slashEnabled: true
        })
        const gain2Option = new SlashCommandStringOption()
            .setName("gain2")
            .setDescription("Gain of the filter in the dl subcommand.")

        const gainOption = new SlashCommandStringOption()
            .setName("gain")
            .setDescription("Gain of the filter or resonance in the dl subcommand.")

        const resonanceOption = new SlashCommandStringOption()
            .setName("resonance")
            .setDescription("Resonance of the filter or freq in the dl subcommand.")

        const freqOption = new SlashCommandStringOption()
            .setName("freq")
            .setDescription("Freq of the filter or dl to apply to an attachment.")

        this.slash = new SlashCommandBuilder()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addStringOption(freqOption)
            .addStringOption(resonanceOption)
            .addStringOption(gainOption)
            .addStringOption(gain2Option)
            .toJSON()
        
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const audio = new Audio(discord, message)
        const perms = new Permission(discord, message)
        if (!audio.checkMusicPermissions()) return
        if (!audio.checkMusicPlaying()) return
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
            await Functions.timeout(3000)
        rep.delete().catch(() => null)
        message.delete().catch(() => null)
        }
        return
    }
}
