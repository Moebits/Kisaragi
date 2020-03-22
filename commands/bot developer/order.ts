import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Order extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Orders the tables in the database.",
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

        await SQLQuery.orderTables()
        orderEmbed
        .setTitle(`**Order** ${discord.getEmoji("gabStare")}`)
        .setDescription("The tables were **ordered**!")
        message.channel.send(orderEmbed)

    }
}
