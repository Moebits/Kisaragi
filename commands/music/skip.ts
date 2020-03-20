import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Skip extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Skips a song, or skips to a song.",
            help:
            `
            \`skip num?\` - Skips to the song at the position (default is next).
            `,
            examples:
            `
            \`=>skip 3\`
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

        let amount = 1
        if (Number(args[1])) {
            amount = Number(args[1])
        }
        const rep = await message.reply("Skipped this song!")
        await audio.skip(amount)
        rep.delete({timeout: 3000})
        return
    }
}
