import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"
import {PixivApi} from "./../../structures/PixivApi"

export default class Chino extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Posts pictures of chino.",
            help:
            `
            \`chino\` - Posts chino pictures.
            `,
            examples:
            `
            \`=>chino\`
            `,
            aliases: [],
            random: "none",
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const pixiv = new PixivApi(discord, message)
        const perms = new Permission(discord, message)
        const pixivArray = await pixiv.animeEndpoint("chino", 10)
        embeds.createReactionEmbed(pixivArray, true, true)
    }
}
