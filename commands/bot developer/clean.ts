import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permissions} from "./../../structures/Permissions"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Clean extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const perms = new Permissions(discord, message)
        const sql = new SQLQuery(message)
        const embeds = new Embeds(discord, message)
        if (perms.checkBotDev(message)) return
        const cleanEmbed = embeds.createEmbed()

        await sql.purgeTable("ignore")
        await sql.purgeTable("collectors")
        await SQLQuery.flushDB()
        cleanEmbed
        .setDescription("Tables were **cleaned**! Cached data was deleted.")
        message.channel.send(cleanEmbed)
    }
}
