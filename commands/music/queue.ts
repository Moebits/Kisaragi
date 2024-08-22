import {Message, EmbedBuilder} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

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
        const perms = new Permission(discord, message)
        if (!audio.checkMusicPermissions()) return
        if (!audio.checkMusicPlaying()) return
        const queue = audio.getQueue() as any
        const queueArray: EmbedBuilder[] = []
        for (let i = 0; i < queue.length; i++) {
            const embed = await audio.updateNowPlaying(i)
            embed
            .setAuthor({name: "queue", iconURL: "https://clipartmag.com/images/musical-notes-png-11.png"})
            .setTitle(`**Position #${i+1}** ${discord.getEmoji("gabYes")}`)
            queueArray.push(embed)
        }
        embeds.createReactionEmbed(queueArray)
        return
    }
}
