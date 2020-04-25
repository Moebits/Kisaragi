import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Order extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Orders the rows in the database.",
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
        const orderEmbed = embeds.createEmbed()

        /*const tables = [
            "auto", "birthdays", "blocks",
            "captcha", "channels", "config",
            "detection", "emojis", "guild info",
            "images", "links", "logs", "misc",
            "points", "prefixes", "roles",
            "special channels", "special roles", "timezones",
            "users", "warns", "welcome leaves"
        ]

        for (let i = 0; i < tables.length; i++) {
            await SQLQuery.foreignKeys(tables[i])
        }*/

        /*let ids = await SQLQuery.selectColumn("guilds", "guild id")
        console.log(ids)
        ids = Functions.removeDuplicates(ids)

        for (let i = 0; i < ids.length; i++) {
            const g = discord.guilds.cache.get(ids[i])
            const msg = await discord.fetchFirstMessage(g || message.guild!)
            await SQLQuery.initGuild(msg || message, true)
        }*/
        await SQLQuery.orderTables()
        orderEmbed
        .setTitle(`**Order** ${discord.getEmoji("gabStare")}`)
        .setDescription("The tables were **ordered**!")
        message.channel.send(orderEmbed)
    }
}
