import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Resume extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Resumes a paused music stream.",
            help:
            `
            \`resume\` - Resumes the stream
            `,
            examples:
            `
            \`=>resume\`
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
        audio.resume()
        const rep = await message.reply("Resumed the song!")
        rep.delete({timeout: 3000})
        return
    }
}
