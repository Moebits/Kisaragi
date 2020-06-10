import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Kisaragi} from "../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"
import {SQLQuery} from "../../structures/SQLQuery"

export default class GCount extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Refreshes the guild count and reposts stats.",
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        const sql = new SQLQuery(message)
        const embeds = new Embeds(discord, message)
        if (!perms.checkBotDev()) return
        discord.user!.setPresence({activity: {type: "PLAYING", name: `=>help | ${this.discord.guilds.cache.size} guilds`, url: "https://www.twitch.tv/imtenpi"}, status: "dnd"})
        discord.postGuildCount()
    }
}
