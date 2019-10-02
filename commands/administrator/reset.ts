import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permissions} from "./../../structures/Permissions"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Captcha extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const perms = new Permissions(discord, message)
        const sql = new SQLQuery(message)
        const embeds = new Embeds(discord, message)
        if (await perms.checkAdmin(message)) return

        const initEmbed: any = embeds.createEmbed()

        await sql.deleteGuild(message.guild!.id)
        await sql.initGuild()
        message.channel.send(
        initEmbed
        .setDescription("All guild settings have been reset to the default."))
        return
    }
}
