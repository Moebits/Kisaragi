import {Message, SlashCommandBuilder, SlashCommandStringOption} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

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
            cooldown: 20,
            slashEnabled: true
        })
        const interp2Option = new SlashCommandStringOption()
            .setName("interp2")
            .setDescription("Interp of the effect in the dl subcommand.")

        const interpOption = new SlashCommandStringOption()
            .setName("interp")
            .setDescription("Interp of the effect or phase in the dl subcommand.")

        const phaseOption = new SlashCommandStringOption()
            .setName("phase")
            .setDescription("Phase of the effect or shape in the dl subcommand.")

        const shapeOption = new SlashCommandStringOption()
            .setName("shape")
            .setDescription("Shape of the effect or speed in the dl subcommand.")

        const speedOption = new SlashCommandStringOption()
            .setName("speed")
            .setDescription("Speed of the effect or width in the dl subcommand.")

        const widthOption = new SlashCommandStringOption()
            .setName("width")
            .setDescription("Width of the effect or regen in the dl subcommand.")

        const regenOption = new SlashCommandStringOption()
            .setName("regen")
            .setDescription("Regen of the effect or depth in the dl subcommand.")

        const depthOption = new SlashCommandStringOption()
            .setName("depth")
            .setDescription("Depth of the effect or delay in the dl subcommand.")

        const delayOption = new SlashCommandStringOption()
            .setName("delay")
            .setDescription("Delay of the effect or dl to apply to an attachment.")

        this.slash = new SlashCommandBuilder()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addStringOption(delayOption)
            .addStringOption(depthOption)
            .addStringOption(regenOption)
            .addStringOption(widthOption)
            .addStringOption(speedOption)
            .addStringOption(shapeOption)
            .addStringOption(phaseOption)
            .addStringOption(interpOption)
            .addStringOption(interp2Option)
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
            const queue = audio.getQueue() as any
            const settings = audio.getSettings() as any
            settings.effects.push("flanger")
            const embed = await audio.updateNowPlaying()
            queue[0].message.edit(embed)
            const rep = await message.reply("Applied a flanger effect to the file!")
            await Functions.timeout(3000)
        rep.delete().catch(() => null)
        message.delete().catch(() => null)
        }
        return
    }
}
