import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Flush extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Flushes the redis database.",
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        const embeds = new Embeds(discord, message)
        if (!perms.checkBotDev()) return
        const flushEmbed = embeds.createEmbed()

        await SQLQuery.flushDB()
        flushEmbed
        .setDescription("The database was **flushed**!")
        message.channel.send(flushEmbed)

    }
}
