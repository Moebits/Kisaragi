import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"
import {PixivApi} from "./../../structures/PixivApi"

export default class Pixiv extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Search for images on pixiv.",
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const pixivApi = new PixivApi(discord, message)
        const perms = new Permission(discord, message)

        const tags = Functions.combineArgs(args, 1)

        if (!args[1]) {
            await pixivApi.getRandomPixivImage()
            return
        }

        if (tags.match(/\d+/g) !== null) {
            await pixivApi.getPixivImageID(tags.match(/\d+/g))
            return
        }

        if (args[1].toLowerCase() === "r18") {
            if (!perms.checkNSFW()) return
            if (args[2].toLowerCase() === "en") {
                const r18Tags = Functions.combineArgs(args, 3)
                await pixivApi.getPixivImage(r18Tags, true, true)
                return
            } else {
                const r18Tags = Functions.combineArgs(args, 2)
                await pixivApi.getPixivImage(r18Tags, true)
                return
            }
        }

        if (args[1].toLowerCase() === "en") {
            const enTags = Functions.combineArgs(args, 2)
            await pixivApi.getPixivImage(enTags, false, true)
            return
        }

        if (args[1].toLowerCase() === "popular") {
            if (args[2].toLowerCase() === "r18") {
                if (!perms.checkNSFW()) return
                await pixivApi.getPopularPixivR18Image()
                return
            }
            await pixivApi.getPopularPixivImage()
            return

        }

        await pixivApi.getPixivImage(tags)
    }
}
