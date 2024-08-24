import {Message, SlashCommandBuilder, SlashCommandStringOption} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

export default class Speed extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Changes the song speed (and optionally, the pitch as well).",
            help:
            `
            _Note: Speed changes are based on the speed of the original file._
            \`speed factor\` - Changes the speed by a factor (eg. 2.0x, 0.5x speed)
            \`speed factor pitch\` - The pitch will change along with the speed.
            \`speed download/dl factor pitch?\` - Applies the effect on an mp3 attachment and uploads it.
            `,
            examples:
            `
            \`=>speed 1.5x\`
            \`=>speed 0.7x pitch\`
            \`=>speed download 2.5x\`
            `,
            aliases: ["timestretch", "tempo"],
            guildOnly: true,
            cooldown: 10,
            slashEnabled: true
        })
        const opt3 = new SlashCommandStringOption()
            .setName("pitch2")
            .setDescription("Optional pitch argument if using the dl subcommand.")

        const pitchOption = new SlashCommandStringOption()
            .setName("pitch")
            .setDescription("Set to pitch to affect the pitch or the factor with the dl subcommand.")

        const factorOption = new SlashCommandStringOption()
            .setName("factor")
            .setDescription("The speed factor or dl to apply on an attachment.")
            .setRequired(true)

        this.slash = new SlashCommandBuilder()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addStringOption(factorOption)
            .addStringOption(pitchOption)
            .addStringOption(opt3)
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
        let setPitch = false
        if (args[1] === "download" || args[1] === "dl") {
            setDownload = true
            args.shift()
        } else if (args[1] === "pitch") {
            setPitch = true
            args.shift()
        }
        const factor = Number(args[1].replace("x", "")) ? Number(args[1].replace("x", "")) : 1.0
        if (args[2] === "pitch") setPitch = true
        const rep = await message.reply("_Changing the speed of the file, please wait..._")
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
        await audio.speed(file, factor, setPitch, setDownload)
        if (rep) rep.delete()
        if (!setDownload) {
            const embed = await audio.updateNowPlaying()
            queue[0].message.edit(embed)
            const rep = await message.reply(`Changed the speed by a factor of ${factor}!`)
            await Functions.timeout(3000)
        rep.delete().catch(() => null)
        message.delete().catch(() => null)
        }
        return
    }
}
