import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Clean extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Deletes cached embeds from the database.",
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
        const cleanEmbed = embeds.createEmbed()

        await sql.purgeTable("ignore")
        await sql.purgeTable("collectors")
        await SQLQuery.flushDB()
        cleanEmbed
        .setDescription("Tables were **cleaned**! Cached data was deleted.")
        message.channel.send(cleanEmbed)
    }
}
