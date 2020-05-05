import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class NowPlaying extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Displays the currently playing song.",
            help:
            `
            \`nowplaying\` - Displays the song that is now playing.
            `,
            examples:
            `
            \`=>nowplaying\`
            `,
            aliases: ["np", "playing"],
            guildOnly: true,
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const audio = new Audio(discord, message)
        if (!audio.checkMusicPermissions()) return
        if (!audio.checkMusicPlaying()) return
        await audio.nowPlaying()
        return
    }
}
