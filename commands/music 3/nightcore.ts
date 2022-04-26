import {Message} from "discord.js"
import {Audio} from "../../structures/Audio"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

export default class Nightcore extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Preset for speed (1.3x pitch).",
            help:
            `
            \`nightcore\` - Applies a nightcore effect (speed 1.3x pitch)
            `,
            examples:
            `
            \`=>nightcore\`
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
        if (!perms.checkBotDev()) return
        if (!audio.checkMusicPermissions()) return
        if (!audio.checkMusicPlaying()) return
        const queue = audio.getQueue() as any
        const file = queue?.[0].file
        const rep = await message.reply("_Applying a nightcore effect, please wait..._")
        await audio.speed(file, 1.3, true)
        if (rep) rep.delete()
        const embed = await audio.updateNowPlaying()
        queue[0].message.edit(embed)
        const rep2 = await message.reply(`Applied a nightcore effect!`)
        rep2.delete({timeout: 3000}).then(() => message.delete().catch(() => null))
        return
    }
}
