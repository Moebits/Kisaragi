import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
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
            `,
            examples:
            `
            \`=>loop\`
            `,
            aliases: ["repeat"],
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const audio = new Audio(discord, message)
        audio.loop()
        message.channel.send("Enabled looping!")
        return
    }
}
