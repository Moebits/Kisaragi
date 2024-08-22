import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

export default class Skip extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Skips a song, or skips to a song.",
            help:
            `
            \`skip\` - Skips to the next song.
            \`skip num/name\` - Skips to the song at the position, or with the given title.
            `,
            examples:
            `
            \`=>skip 3\`
            \`=>skip rainfall\`
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
        const perms = new Permission(discord, message)
        if (!audio.checkMusicPermissions()) return
        if (!audio.checkMusicPlaying()) return
        const input = Functions.combineArgs(args, 1)

        let amount = 1
        if (Number(input)) {
            amount = Number(input)
        } else if (input) {
            const queue = audio.getQueue() as any
            const index =  queue.findIndex((q: any) => q.title.toLowerCase().includes(input.toLowerCase()))
            if (index === -1) return message.reply(`Could not find a song with that name ${discord.getEmoji("kannaCurious")}`)
            amount = index + 1
        }
        const text = amount === 1 ? "Skipped this song!" : (Number(input) ? `Skipped to the song at position **${amount}**!` : `Skipped to **${input}**!`)
        await message.reply(text)
        await audio.skip(amount)
        return
    }
}
