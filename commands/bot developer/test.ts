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

        const g = discord.guilds.cache.get(args[1])
        const msg = await discord.fetchFirstMessage(g || message.guild!)
        await SQLQuery.initGuild(msg || message, true)

        // await pixiv.animeEndpoint("all")
        message.channel.send("done")
    }
}
