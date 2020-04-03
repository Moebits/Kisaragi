import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Kisaragi} from "./../../structures/Kisaragi"
import {PixivApi} from "./../../structures/PixivApi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Test extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "For general tests.",
            aliases: [],
            cooldown: 3,
            unlist: true
        })
    }

    public run = async (args: string[]) => {
        const message = this.message
        const discord = this.discord
        const pixiv = new PixivApi(discord, message)

        await pixiv.animeEndpoint("all")
        console.log("done")
    }
}
