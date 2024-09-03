import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Captcha extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Deletes and resets all data on your guild (no undo).",
            help:
            `
            \`reset\` - Resets all data
            `,
            examples:
            `
            \`=>reset\`
            `,
            guildOnly: true,
            aliases: [],
            cooldown: 10
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

        await SQLQuery.deleteGuild(message.guild!.id)
        await SQLQuery.initGuild(message, true)
        message.channel.send({embeds:
        [initEmbed
        .setTitle(`**Reset** ${discord.getEmoji("kaosWTF")}`)
        .setDescription("All guild settings have been reset to the default!")]})
        return
    }
}
