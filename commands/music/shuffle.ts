import {Message} from "discord.js"
import {SlashCommandSubcommand, SlashCommandOption} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

export default class Shuffle extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Shuffles the queue.",
            help:
            `
            \`shuffle\` - Shuffles the queue.
            `,
            examples:
            `
            \`=>shuffle\`
            `,
            aliases: [],
            guildOnly: true,
            cooldown: 5,
            subcommandEnabled: true
        })
        this.subcommand = new SlashCommandSubcommand()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const audio = new Audio(discord, message)
        if (!audio.checkMusicPermissions()) return
        if (!audio.checkMusicPlaying()) return
        audio.shuffle()
        const rep = await this.reply("Shuffled the queue!")
        await Functions.timeout(3000)
        rep.delete().catch(() => null)
        message.delete().catch(() => null)
    }
}
