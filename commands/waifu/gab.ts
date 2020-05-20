import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
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
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const pixiv = new PixivApi(discord, message)
        const perms = new Permission(discord, message)
        if (discord.checkMuted(message)) if (!perms.checkNSFW()) return

        const pixivArray = await pixiv.animeEndpoint("gabriel", 10)
        embeds.createReactionEmbed(pixivArray, true, true)
    }
}
