import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Order extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Deletes all data from the database.",
            aliases: ["resetdb"],
            cooldown: 3,
            unlist: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        const embeds = new Embeds(discord, message)
        const sql = new SQLQuery(message)
        if (!perms.checkBotDev()) return
        const purgeEmbed = embeds.createEmbed()

        // await SQLQuery.purgeDB()
        // await SQLQuery.initGuild(message)
        purgeEmbed
        .setTitle(`**Purge** ${discord.getEmoji("gabStare")}`)
        .setDescription("**Purged the database**!")
        message.channel.send({embeds: [purgeEmbed]})
    }
}
