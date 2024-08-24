import {Message, SlashCommandBuilder, SlashCommandStringOption} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

export default class Fastforward extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Fastforwards the position of the song.",
            help:
            `
            \`fastforward time\` - Fastforwards the song, time can be in \`00:00\`, \`0m 0s\`, or \`00\` format
            `,
            examples:
            `
            \`=>fastforward 30s\`
            `,
            aliases: ["seek"],
            guildOnly: true,
            cooldown: 5,
            slashEnabled: true
        })
        const timeOption = new SlashCommandStringOption()
            .setName("time")
            .setDescription("Time to fastforward.")
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

        let fastforward = args[1] ? args[1] : "0"
        fastforward = fastforward.replace(/h|m/gi, ":").replace(/s/gi, "").replace(/ +/g, "")
        await audio.fastforward(fastforward)
        const queue = audio.getQueue() as any
        const embed = await audio.updateNowPlaying()
        queue[0].message.edit(embed)
        const rep = await message.reply(`Fastforwarded the song!`)
        await Functions.timeout(3000)
        rep.delete().catch(() => null)
        message.delete().catch(() => null)
        return
    }
}
