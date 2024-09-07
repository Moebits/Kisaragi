import {Message, SlashCommandBuilder, SlashCommandStringOption} from "discord.js"
import {SlashCommandOption} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

export default class Rewind extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Rewinds the position of the song.",
            help:
            `
            \`rewind time\` - Rewinds the song, time can be in \`00:00\`, \`0m 0s\`, or \`00\` format
            `,
            examples:
            `
            \`=>rewind 10s\`
            `,
            aliases: ["seek"],
            guildOnly: true,
            cooldown: 5,
            slashEnabled: true
        })
        const timeOption = new SlashCommandStringOption()
            .setName("time")
            .setDescription("Time to rewind.")
            .setRequired(true)

        this.slash = new SlashCommandBuilder()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addStringOption(timeOption)
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

        let rewind = args[1] ? args[1] : "0"
        rewind = rewind.replace(/h|m/gi, ":").replace(/s/gi, "").replace(/ +/g, "")
        await audio.rewind(rewind)
        const queue = audio.getQueue() as any
        const embed = await audio.updateNowPlaying()
        queue[0].message.edit(embed)
        const rep = await message.reply(`Rewinded the song!`)
        await Functions.timeout(3000)
        rep.delete().catch(() => null)
        message.delete().catch(() => null)
        return
    }
}
