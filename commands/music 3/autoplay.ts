import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Autoplay extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Autoplays default songs when there are no songs left in the queue.",
            help:
            `
            \`autoplay\` - Toggles autoplay.
            `,
            examples:
            `
            \`=>autoplay\`
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
        if (!audio.checkMusicPermissions()) return
        if (!audio.checkMusicPlaying()) return
        audio.autoplay()
        const queue = audio.getQueue() as any
        const settings = audio.getSettings() as any
        const embed = await audio.updateNowPlaying()
        queue[0].message.edit(embed)
        const text = settings.autoplay === true ? "on" : "off"
        const rep = await message.reply(`Turned ${text} autoplay!`)
        rep.delete({timeout: 3000}).then(() => message.delete().catch(() => null))
        return
    }
}
