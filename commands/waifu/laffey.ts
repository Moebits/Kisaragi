import {Message} from "discord.js"
import {SlashCommandSubcommand} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"
import {PixivApi} from "./../../structures/PixivApi"

export default class Laffey extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Posts pictures of laffey.",
            help:
            `
            \`laffey\` - Posts laffey pictures.
            `,
            examples:
            `
            \`=>laffey\`
            `,
            aliases: [],
            random: "none",
            cooldown: 10,
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

        const pixivArray = await pixiv.animeEndpoint("laffey", 10)
        embeds.createReactionEmbed(pixivArray, true, true)
    }
}
