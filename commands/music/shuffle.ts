import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Shuffle extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Shuffles the queue.",
            help:
            `
            \`shuffle\` - Shuffles the queue.
            `,
            examples:
            `
            \`=>shuffle\`
            `,
            aliases: [],
            guildOnly: true,
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const audio = new Audio(discord, message)
        if (!audio.checkMusicPermissions()) return
        if (!audio.checkMusicPlaying()) return
        audio.shuffle()
        const rep = await message.reply("Shuffled the queue!")
        rep.delete({timeout: 3000}).then(() => message.delete().catch(() => null))
        return
    }
}
