import {Message, SlashCommandBuilder, SlashCommandStringOption} from "discord.js"
import {SlashCommandOption} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

export default class Delay extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Applies a delay effect to an audio file.",
            help:
            `
            _Note: You can add a variable number of delay and decay pairs. An odd amount of arguments is invalid. The unit is milliseconds._
            \`delay delay decay ...delay decay pairs?\` - Applies delay to the audio file with the parameters.
            \`delay download/dl\` - Applies delay to an attachment and uploads it.
            `,
            examples:
            `
            \`=>delay 80 0.4 60 0.5\`
            \`=>delay download 1000 0.5 400 0.7\`
            `,
            aliases: [],
            guildOnly: true,
            cooldown: 20,
            slashEnabled: true
        })
        const delay2Option = new SlashCommandStringOption()
            .setName("delaypairs2")
            .setDescription("Add delay and decay pairs in the dl subcommand.")

        const delayOption = new SlashCommandStringOption()
            .setName("delaypairs")
            .setDescription("Add an even amount of delay and decay pairs separated by space, or dl to apply to an attachment.")

        this.slash = new SlashCommandBuilder()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addStringOption(delayOption)
            .addStringOption(delay2Option)
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
        args = args.flat(Infinity).join(" ").split(/\s+/)
        let setDownload = false
        if (args[1] === "download" || args[1] === "dl") {
            setDownload = true
            args.shift()
        }
        const delaysDecays: number[] = []
        for (let i = 0; i < args.length; i++) {
            if (Number(args[i])) {
                delaysDecays.push(Number(args[i]))
            }
        }
        if (delaysDecays.length % 2 === 1) return message.reply(`There must be an even amount of arguments (delay and decay pairs).`)
        const rep = await message.reply("_Adding delay to the file, please wait..._")
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
            await audio.delay(file, delaysDecays, setDownload)
        } catch {
            return message.reply("Sorry, these parameters will cause clipping distortion on the audio file.")
        }
        if (rep) rep.delete()
        if (!setDownload) {
            const queue = audio.getQueue() as any
            const settings = audio.getSettings() as any
            settings.effects.push("delay")
            const embed = await audio.updateNowPlaying()
            queue[0].message.edit(embed)
            const rep = await message.reply("Applied a delay effect to the file!")
            await Functions.timeout(3000)
        rep.delete().catch(() => null)
        message.delete().catch(() => null)
        }
        return
    }
}
