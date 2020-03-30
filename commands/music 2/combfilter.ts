import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class CombFilter extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Applies a comb filter to an audio file (disabled).",
            help:
            `
            _Note: Delay is in milliseconds, decay is in seconds._
            \`combfilter delay? decay?\` - Adds a comb filter with the specified parameters.
            `,
            examples:
            `
            \`=>combfilter\`
            `,
            aliases: [],
            guildOnly: true,
            cooldown: 5,
            unlist: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const audio = new Audio(discord, message)
        const queue = audio.getQueue() as any
        return message.reply("This command is currently disabled.")
        const file = queue?.[0].file
        let delay = parseInt(args[1], 10)
        let decay = parseInt(args[2], 10)
        if (!delay) delay = 70
        if (!decay) decay = 0.5
        if (Number.isNaN(delay) || Number.isNaN(decay)) return message.reply(`The parameters must be numbers ${discord.getEmoji("kannaCurious")}`)
        await audio.combFilter(file, delay, decay)
        message.reply("Applied a comb filter!")
        return
    }
}
