import {Message} from "discord.js"
import {SlashCommandSubcommand} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Kisaragi} from "../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"
import {PixivApi} from "../../structures/PixivApi"

export default class Gab extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Posts pictures of gabriel.",
            help:
            `
            \`gab\` - Posts gabriel pictures.
            `,
            examples:
            `
            \`=>gab\`
            `,
            aliases: ["gabriel", "tenma"],
            random: "none",
            cooldown: 10,
            defer: true,
            subcommandEnabled: true
        })
        this.subcommand = new SlashCommandSubcommand()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const pixiv = new PixivApi(discord, message)
        const perms = new Permission(discord, message)

        const pixivArray = await pixiv.animeEndpoint("gabriel", 10)
        embeds.createReactionEmbed(pixivArray, true, true)
    }
}
