import {Message} from "discord.js"
import {SlashCommandSubcommand, SlashCommandOption} from "../../structures/SlashCommandOption"
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
            subcommandEnabled: true
        })
        const depth2Option = new SlashCommandOption()
            .setType("string")
            .setName("depth2")
            .setDescription("Depth of the effect in the dl subcommand.")

        const depthOption = new SlashCommandOption()
            .setType("string")
            .setName("depth")
            .setDescription("Depth of the effect or speed in dl subcommand.")

        const speedOption = new SlashCommandOption()
            .setType("string")
            .setName("speed")
            .setDescription("Speed of the effect or decay in dl subcommand.")

        const decayOption = new SlashCommandOption()
            .setType("string")
            .setName("decay")
            .setDescription("Decay of the effect or delay in dl subcommand.")

        const delayOption = new SlashCommandOption()
            .setType("string")
            .setName("delay")
            .setDescription("Delay of the effect or dl to apply to an attachment.")

        this.subcommand = new SlashCommandSubcommand()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addOption(delayOption)
            .addOption(decayOption)
            .addOption(speedOption)
            .addOption(depthOption)
            .addOption(depth2Option)
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const audio = new Audio(discord, message)
        const perms = new Permission(discord, message)
        if (!audio.checkMusicPermissions()) return
        if (!audio.checkMusicPlaying()) return
        const queue = audio.getQueue()
        let setDownload = false
        if (args[1] === "download" || args[1] === "dl") {
            setDownload = true
            args.shift()
        }
        const delay = Number(args[1])
        const decay = Number(args[2])
        const speed = Number(args[3])
        const depth = Number(args[4])
        const rep = await this.reply("_Adding chorus to the file, please wait..._")
        let file = ""
        if (setDownload) {
            const regex = new RegExp(/.(mp3|wav|flac|ogg|aiff)/)
            const attachment = await discord.fetchLastAttachment(message, false, regex)
            if (!attachment) return this.reply(`Only **mp3**, **wav**, **flac**, **ogg**, and **aiff** files are supported.`)
            file = attachment
        } else {
            const queue = audio.getQueue()
            file = queue?.[0].file
        }
        try {
            await audio.chorus(file, delay, decay, speed, depth, setDownload)
        } catch {
            return this.reply("Sorry, these parameters will cause clipping distortion on the audio file.")
        }
        if (rep) rep.delete()
        if (!setDownload) {
            const queue = audio.getQueue()
            const settings = audio.getSettings()
            settings.effects.push("chorus")
            const embed = await audio.updateNowPlaying()
            discord.edit(queue[0].message!, embed)
            const rep = await this.reply("Applied a chorus effect to the file!")
            await Functions.timeout(3000)
        rep.delete().catch(() => null)
        if (message instanceof Message) message.delete().catch(() => null)
        }
    }
}
