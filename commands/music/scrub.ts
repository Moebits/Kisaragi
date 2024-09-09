import {Message} from "discord.js"
import {SlashCommandSubcommand, SlashCommandOption} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

export default class Scrub extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Starts playing from a new position.",
            help:
            `
            _Note: The song will be skipped if the position is longer than the song length._
            \`scrub time?\` - Starts playing at the time in \`00:00\`, \`0m 0s\`, or \`00\` format
            `,
            examples:
            `
            \`=>scrub 1:00\`
            `,
            aliases: ["seek"],
            guildOnly: true,
            cooldown: 5,
            subcommandEnabled: true
        })
        const timeOption = new SlashCommandOption()
            .setType("string")
            .setName("time")
            .setDescription("Time to scrub or 0 by default.")

        this.subcommand = new SlashCommandSubcommand()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addStringOption(timeOption)
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const audio = new Audio(discord, message)
        const perms = new Permission(discord, message)
        if (!audio.checkMusicPermissions()) return
        if (!audio.checkMusicPlaying()) return

        let scrub = args[1] ? args[1] : "0"
        scrub = scrub.replace(/h|m/gi, ":").replace(/s/gi, "").replace(/ +/g, "")
        await audio.scrub(scrub)
        const queue = audio.getQueue() as any
        const embed = await audio.updateNowPlaying()
        queue[0].message.edit(embed)
        const rep = await message.reply(`Changed the position of the song!`)
        await Functions.timeout(3000)
        rep.delete().catch(() => null)
        message.delete().catch(() => null)
        return
    }
}
