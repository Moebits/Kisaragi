import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"
import {PixivApi} from "./../../structures/PixivApi"

export default class Uzuki extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Posts pictures of uzuki.",
            help:
            `
            \`uzuki\` - Posts uzuki pictures.
            `,
            examples:
            `
            \`=>uzuki\`
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

        const pixivArray = await pixiv.animeEndpoint("uzuki", 10)
        embeds.createReactionEmbed(pixivArray, true, true)
    }
}
