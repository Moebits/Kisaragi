import {Message, SlashCommandBuilder, SlashCommandStringOption} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

export default class Distortion extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Applies distortion to an audio file.",
            help:
            `
            \`distortion gain? color?\` - Applies distortion to the audio file with the parameters.
            \`distortion download/dl gain? color?\` - Applies distortion to an attachment and uploads it.
            `,
            examples:
            `
            \`=>distortion 10 10\`
            \`=>distortion download 20 20\`
            `,
            aliases: ["overdrive"],
            guildOnly: true,
            cooldown: 20,
            slashEnabled: true
        })
        const color2Option = new SlashCommandStringOption()
            .setName("color2")
            .setDescription("Color of the effect in the dl subcommand.")

        const colorOption = new SlashCommandStringOption()
            .setName("color")
            .setDescription("Color of the effect or gain in the dl subcommand.")

        const gainOption = new SlashCommandStringOption()
            .setName("gain")
            .setDescription("Gain of the effect or dl to apply to an attachment.")

        this.slash = new SlashCommandBuilder()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addStringOption(gainOption)
            .addStringOption(colorOption)
            .addStringOption(color2Option)
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
        const gain = Number(args[1])
        const color = Number(args[2])
        const rep = await message.reply("_Adding distortion to the file, please wait..._")
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
            await audio.distortion(file, gain, color, setDownload)
        } catch {
            return message.reply("Sorry, these parameters will cause clipping distortion on the audio file.")
        }
        if (rep) rep.delete()
        if (!setDownload) {
            const queue = audio.getQueue() as any
            const settings = audio.getSettings() as any
            settings.effects.push("distortion")
            const embed = await audio.updateNowPlaying()
            queue[0].message.edit(embed)
            const rep = await message.reply("Applied a distortion effect to the file!")
            await Functions.timeout(3000)
        rep.delete().catch(() => null)
        message.delete().catch(() => null)
        }
        return
    }
}
