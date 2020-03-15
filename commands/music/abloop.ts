import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class ABLoop extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Loops a song from point A to point B.",
            help:
            `
            _Note: Also see \`loop\`, the time format is the same \`00:00\`,_
            \`abloop start end\` - Loops the current song between the times.
            `,
            examples:
            `
            \`=>abloop 1:30 2:30\`
            `,
            aliases: [],
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const audio = new Audio(discord, message)
        const queue = audio.getQueue() as any
        const start = args[1] ? args[1] : "0"
        const end = args[2] ? args[2] : queue[0]?.duration
        audio.abloop(start, end)
        const rep = await message.reply("Enabled A-B looping!")
        rep.delete({timeout: 3000})
        return
    }
}
