import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Clear extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Clears all effects applied to a track.",
            help:
            `
            \`clear\` - Clears all effects.
            `,
            examples:
            `
            \`=>clear\`
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
        audio.clear()
        const rep = await message.reply("Cleared all effects!")
        rep.delete({timeout: 3000})
        return
    }
}
