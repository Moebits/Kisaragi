import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Captcha extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Reset all settings to the default.",
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
        if (!await perms.checkAdmin()) return

        const initEmbed = embeds.createEmbed()

        await sql.deleteGuild(message.guild!.id)
        await sql.initGuild()
        message.channel.send(
        initEmbed
        .setDescription("All guild settings have been reset to the default."))
        return
    }
}