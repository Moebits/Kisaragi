import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class NowPlaying extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Displays the entire queue of songs.",
            help:
            `
            \`nowplaying\` - Displays the queue.
            `,
            examples:
            `
            \`=>nowplaying\`
            `,
            aliases: ["np", "queue", "playing"],
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const audio = new Audio(discord, message)
        const np = await audio.nowPlaying()
        if (np) message.channel.send(np)
        return
    }
}
