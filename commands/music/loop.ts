import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {CommandFunctions} from "./../../structures/CommandFunctions"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Loop extends Command {
    constructor(discord: Kisaragi, message: Message) {
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
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const cmd = new CommandFunctions(discord, message)
        const audio = new Audio(discord, message)
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
        rep.delete({timeout: 3000}).then(() => message.delete().catch(() => null))
        return
    }
}
