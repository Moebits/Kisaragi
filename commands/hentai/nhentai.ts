import {Message} from "discord.js"
import * as blacklist from "../../blacklist.json"
import {Command} from "../../structures/Command"
import {Images} from "../../structures/Images.js"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

const nhentai = require("nhentai-js")

export default class $nHentai extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public nhentaiRandom = async (filter?: boolean) => {
        let random = "0"
        while (!await nhentai.exists(random)) {
            random = Math.floor(Math.random() * 1000000).toString()
        }
        const doujin = await nhentai.getDoujin(random)
        if (filter) {
            for (const i in doujin.details.tags) {
                for (let j = 0; j < blacklist.nhentai.length; j++) {
                    if (doujin.details.tags[i] === blacklist.nhentai[j]) {
                        await this.nhentaiRandom(true)
                    }
                }
            }
        }
        return doujin
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const images = new Images(discord, message)

        if (!args[1]) {
            const doujin = await this.nhentaiRandom(false)
            images.getNhentaiDoujin(doujin, doujin.link.match(/\d+/g))
            return
        } else {

            if (args[1].toLowerCase() === "random") {
                const doujin = await this.nhentaiRandom(true)
                images.getNhentaiDoujin(doujin, doujin.link.match(/\d+/g))
                return
            }

            const tag = Functions.combineArgs(args, 1)
            if (tag.match(/\d+/g) !== null) {
                const doujin = await nhentai.getDoujin(tag.match(/\d+/g)!.toString())
                images.getNhentaiDoujin(doujin, tag.match(/\d+/g)!.toString())
            } else {
                const result = await nhentai.search(tag)
                const index = Math.floor(Math.random() * 10)
                const book = result.results[index]
                const doujin = await nhentai.getDoujin(book.bookId)
                images.getNhentaiDoujin(doujin, book.bookId)
            }
        }
    }
}
