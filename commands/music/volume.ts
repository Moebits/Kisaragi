import {Message} from "discord.js"
import {SlashCommandSubcommand, SlashCommandOption} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

export default class Volume extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Sets the volume of the music stream.",
            help:
            `
            \`volume num\` - Sets the volume (0-200)
            `,
            examples:
            `
            \`=>volume 150\`
            `,
            aliases: [],
            guildOnly: true,
            cooldown: 5,
            subcommandEnabled: true
        })
        const volumeOption = new SlashCommandOption()
            .setType("integer")
            .setName("volume")
            .setDescription("The new volume (0-200)")
            .setRequired(true)

        this.subcommand = new SlashCommandSubcommand()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addOption(volumeOption)
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const audio = new Audio(discord, message)
        const perms = new Permission(discord, message)
        if (!audio.checkMusicPermissions()) return
        if (!audio.checkMusicPlaying()) return

        if (!Number(args[1])) return this.message.reply(`What do you want to set the volume to ${discord.getEmoji("kannaCurious")}`)
        audio.volume(Number(args[1]))
        const rep = await message.reply("Changed the volume!")
        await Functions.timeout(3000)
        rep.delete().catch(() => null)
        message.delete().catch(() => null)
        return
    }
}
