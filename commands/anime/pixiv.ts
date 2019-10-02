import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {PixivApi} from "./../../structures/PixivApi"

export default class Pixiv extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const pixivApi = new PixivApi(discord, message)

        const tags = Functions.combineArgs(args, 1)
        const refreshToken = await pixivApi.pixivLogin()

        if (!args[1]) {
            await pixivApi.getRandomPixivImage(refreshToken)
            return
        }

        if (tags.match(/\d+/g) !== null) {
            await pixivApi.getPixivImageID(refreshToken, tags.match(/\d+/g))
            return
        }

        if (args[1].toLowerCase() === "r18") {
            if (args[2].toLowerCase() === "en") {
                const r18Tags = Functions.combineArgs(args, 3)
                await pixivApi.getPixivImage(refreshToken, r18Tags, true, true)
                return
            } else {
                const r18Tags = Functions.combineArgs(args, 2)
                await pixivApi.getPixivImage(refreshToken, r18Tags, true)
                return
            }
        }

        if (args[1].toLowerCase() === "en") {
            const enTags = Functions.combineArgs(args, 2)
            await pixivApi.getPixivImage(refreshToken, enTags, false, true)
            return
        }

        if (args[1].toLowerCase() === "popular") {
            if (args[2].toLowerCase() === "r18") {
                await pixivApi.getPopularPixivR18Image(refreshToken)
                return
            }
            await pixivApi.getPopularPixivImage(refreshToken)
            return

        }

        await pixivApi.getPixivImage(refreshToken, tags)
    }
}
