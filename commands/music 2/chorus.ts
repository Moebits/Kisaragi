import {Message, SlashCommandBuilder, SlashCommandStringOption} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

export default class Chorus extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Applies a chorus effect to an audio file.",
            help:
            `
            \`chorus delay? decay? speed? depth?\` - Applies chorus to the audio file with the parameters.
            \`chorus download/dl delay? decay? speed? depth?\` - Applies chorus to an attachment and uploads it.
            `,
            examples:
            `
            \`=>chorus 55 0.3 25 3\`
            \`=>chorus download 50 0.5 30 2\`
            `,
            aliases: [],
            guildOnly: true,
            cooldown: 20,
            slashEnabled: true
        })
        const depth2Option = new SlashCommandStringOption()
            .setName("depth2")
            .setDescription("Depth of the effect in the dl subcommand.")

        const depthOption = new SlashCommandStringOption()
            .setName("depth")
            .setDescription("Depth of the effect or speed in dl subcommand.")

        const speedOption = new SlashCommandStringOption()
            .setName("speed")
            .setDescription("Speed of the effect or decay in dl subcommand.")

        const decayOption = new SlashCommandStringOption()
            .setName("decay")
            .setDescription("Decay of the effect or delay in dl subcommand.")

        const delayOption = new SlashCommandStringOption()
            .setName("delay")
            .setDescription("Delay of the effect or dl to apply to an attachment.")

        this.slash = new SlashCommandBuilder()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addStringOption(delayOption)
            .addStringOption(decayOption)
            .addStringOption(speedOption)
            .addStringOption(depthOption)
            .addStringOption(depth2Option)
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
        const decay = Number(args[2])
        const speed = Number(args[3])
        const depth = Number(args[4])
        const rep = await message.reply("_Adding chorus to the file, please wait..._")
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
            await audio.chorus(file, delay, decay, speed, depth, setDownload)
        } catch {
            return message.reply("Sorry, these parameters will cause clipping distortion on the audio file.")
        }
        if (rep) rep.delete()
        if (!setDownload) {
            const queue = audio.getQueue() as any
            const settings = audio.getSettings() as any
            settings.effects.push("chorus")
            const embed = await audio.updateNowPlaying()
            queue[0].message.edit(embed)
            const rep = await message.reply("Applied a chorus effect to the file!")
            await Functions.timeout(3000)
        rep.delete().catch(() => null)
        message.delete().catch(() => null)
        }
        return
    }
}
