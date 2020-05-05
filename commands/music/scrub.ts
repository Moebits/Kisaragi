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
            \`scrub time?\` - Starts playing at the time in \`00:00\`, \`0m 0s\`, or \`00\` format
            `,
            examples:
            `
            \`=>scrub 1:00\`
            `,
            aliases: ["seek"],
            guildOnly: true,
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const audio = new Audio(discord, message)
        if (!audio.checkMusicPermissions()) return
        if (!audio.checkMusicPlaying()) return

        let scrub = args[1] ? args[1] : "0"
        scrub = scrub.replace(/h|m/gi, ":").replace(/s/gi, "").replace(/ +/g, "")
        await audio.scrub(scrub)
        const queue = audio.getQueue() as any
        const embed = await audio.updateNowPlaying()
        queue[0].message.edit(embed)
        const rep = await message.reply(`Changed the position of the song!`)
        rep.delete({timeout: 3000}).then(() => message.delete().catch(() => null))
        return
    }
}
