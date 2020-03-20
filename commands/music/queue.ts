import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Queue extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Displays the full queue of songs.",
            help:
            `
            \`queue\` - Shows the queue of songs.
            `,
            examples:
            `
            \`=>queue\`
            `,
            aliases: [],
            guildOnly: true,
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const audio = new Audio(discord, message)
        const queue = audio.getQueue() as any
        const queueArray: MessageEmbed[] = []
        for (let i = 0; i < queue.length; i++) {
            const embed = await audio.updateNowPlaying(i)
            embed
            .setAuthor("queue", "https://clipartmag.com/images/musical-notes-png-11.png")
            .setTitle(`**Position #${i+1}** ${discord.getEmoji("gabYes")}`)
            queueArray.push(embed)
        }
        embeds.createReactionEmbed(queueArray)
        return
    }
}
