import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Pause extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Pauses a music stream.",
            help:
            `
            \`pause\` - Pauses the stream
            `,
            examples:
            `
            \`=>pause\`
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
        audio.pause()
        const rep = await message.reply("Paused the song!")
        rep.delete({timeout: 3000}).then(() => message.delete().catch(() => null))
        return
    }
}
