import {Message, SlashCommandBuilder} from "discord.js"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

export default class Bassboost extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Preset for lowshelf (500Hz, +5db).",
            help:
            `
            \`bassboost\` - Applies bass boosting (lowshelf 10 500 100)
            `,
            examples:
            `
            \`=>bassboost\`
            `,
            aliases: ["bass"],
            guildOnly: true,
            cooldown: 20,
            slashEnabled: true
        })
        this.slash = new SlashCommandBuilder()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .toJSON()
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
        const rep = await message.reply("_Applying a bass boost, please wait..._")
        const file = queue?.[0].file
        await audio.lowshelf(file, 10, 500, 100)
        if (rep) rep.delete()
        const settings = audio.getSettings() as any
        settings.filters.push("lowshelf")
        const embed = await audio.updateNowPlaying()
        queue[0].message.edit(embed)
        const rep2 = await message.reply("Applied bass boosting!")
        await Functions.timeout(3000)
        rep2.delete().catch(() => null)
        message.delete().catch(() => null)
        return
    }
}
