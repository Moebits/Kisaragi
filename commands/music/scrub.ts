import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Scrub extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Starts playing from a new position.",
            help:
            `
            _Note: The song will be skipped if the position is longer than the song length._
            \`scrub position?\` - Starts playing at the position \`00:00:00\`, \`00:00\`, or \`00\` format
            `,
            examples:
            `
            \`=>scrub 1:00\`
            `,
            aliases: ["seek"],
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const audio = new Audio(discord, message)

        const scrub = args[1] ? args[1] : "0"
        await audio.scrub(scrub)
        const rep = await message.reply(`Changed the position of the song!`)
        rep.delete({timeout: 3000})
        return
    }
}
