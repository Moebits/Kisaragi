import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"
import {PixivApi} from "./../../structures/PixivApi"

export default class Hibiki extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Posts pictures of hibiki.",
            help:
            `
            \`hibiki\` - Posts hibiki pictures.
            `,
            examples:
            `
            \`=>hibiki\`
            `,
            aliases: [],
            random: "none",
            cooldown: 10,
            nsfw: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const pixiv = new PixivApi(discord, message)
        const perms = new Permission(discord, message)
        if (discord.checkMuted(message)) if (!perms.checkNSFW()) return

        const pixivArray = await pixiv.animeEndpoint("hibiki", 10)
        embeds.createReactionEmbed(pixivArray, true, true)
    }
}
