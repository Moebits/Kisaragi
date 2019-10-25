import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"
import {PixivApi} from "./../../structures/PixivApi"

export default class Pixiv extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Search for anime images on pixiv.",
            help:
            `
            \`pixiv\` - Gets a random pixiv image.
            \`pixiv link/id\` - Gets the pixiv or ugoira image from the link.
            \`pixiv tag\` - Gets a pixiv image with the tag (translated to japanese).
            \`pixiv en tag\` - Gets a pixiv image with the tag (not translated).
            \`pixiv popular\` - Gets a pixiv image from the daily rankings.
            \`pixiv r18 tag\` - Gets an R-18 pixiv image from the tag (translated to japanese).
            \`pixiv r18 en tag\` - Gets an R-18 pixiv image from the tag (not translated).
            \`pixiv r18 popular\` - Gets a random image from the R-18 daily rankings.
            \`all\` - Add this to include illusts with under 100 bookmarks.
            `,
            examples:
            `
            \`=>pixiv\`
            \`=>pixiv azur lane\`
            \`=>pixiv black tights\`
            \`=>pixiv r18 sagiri izumi\`
            \`=>pixiv r18 megumin\`
            \`=>pixiv r18 popular\`
            `,
            aliases: ["p"],
            cooldown: 30
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const pixivApi = new PixivApi(discord, message)
        const perms = new Permission(discord, message)

        let tags = Functions.combineArgs(args, 1)
        if (!tags) tags = "女の子"

        if (tags.match(/\d\d\d+/g)) {
            await pixivApi.getPixivImageID(String(tags.match(/\d+/g)))
            return
        }

        if (args[1] && args[1].toLowerCase() === "r18") {
            if (!perms.checkNSFW()) return
            if (args[2] && args[2].toLowerCase() === "en") {
                let r18Tags = Functions.combineArgs(args, 3)
                if (!r18Tags) r18Tags = "女の子"
                await pixivApi.getPixivImage(r18Tags, true, true)
                return
            } else if (args[2] && args[2] === "popular") {
                await pixivApi.getPopularPixivR18Image()
                return
            } else {
                let r18Tags = Functions.combineArgs(args, 2)
                if (!r18Tags) r18Tags = "女の子"
                await pixivApi.getPixivImage(r18Tags, true)
                return
            }
        }

        if (args[1] && args[1].toLowerCase() === "en") {
            let enTags = Functions.combineArgs(args, 2)
            if (!enTags) enTags = "女の子"
            await pixivApi.getPixivImage(enTags, false, true)
            return
        } else if (args[1] && args[1].toLowerCase() === "popular") {
            await pixivApi.getPopularPixivImage()
            return
        }

        await pixivApi.getPixivImage(tags)
    }
}
