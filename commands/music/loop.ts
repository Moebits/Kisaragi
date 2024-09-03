import {Message, SlashCommandBuilder, SlashCommandStringOption} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {CommandFunctions} from "./../../structures/CommandFunctions"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

export default class Loop extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Loops the current track, or stops looping.",
            help:
            `
            \`loop\` - Loops the current track.
            \`loop link/query\` - An alias for \`play loop\`.
            `,
            examples:
            `
            \`=>loop\`
            `,
            aliases: ["repeat"],
            guildOnly: true,
            cooldown: 10,
            slashEnabled: true
        })
        const linkOption = new SlashCommandStringOption()
            .setName("query")
            .setDescription("Optional song link/query to play.")

        this.slash = new SlashCommandBuilder()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addStringOption(linkOption)
            .toJSON()
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const cmd = new CommandFunctions(discord, message)
        const audio = new Audio(discord, message)
        const perms = new Permission(discord, message)
        if (Functions.combineArgs(args, 1).trim()) {
            args.shift()
            return cmd.runCommand(message, ["play", "loop", ...args])
        }
        if (!audio.checkMusicPermissions()) return
        if (!audio.checkMusicPlaying()) return
        audio.loop()
        const queue = audio.getQueue() as any
        const embed = await audio.updateNowPlaying()
        queue[0].message.edit(embed)
        const rep = await message.reply("Enabled looping!")
        await Functions.timeout(3000)
        rep.delete().catch(() => null)
        message.delete().catch(() => null)
        return
    }
}
