import {Message, SlashCommandBuilder} from "discord.js"
import {SlashCommandOption} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

export default class Resume extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Resumes a paused music stream.",
            help:
            `
            \`resume\` - Resumes the stream
            `,
            examples:
            `
            \`=>resume\`
            `,
            aliases: [],
            guildOnly: true,
            cooldown: 5,
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
        audio.resume()
        const rep = await message.reply("Resumed the song!")
        await Functions.timeout(3000)
        rep.delete().catch(() => null)
        message.delete().catch(() => null)
        return
    }
}
