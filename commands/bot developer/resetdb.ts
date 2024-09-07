import {Message} from "discord.js"
import {SlashCommandOption} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "../../structures/Embeds"
import {Kisaragi} from "../../structures/Kisaragi"
import {SQLQuery} from "../../structures/SQLQuery"

export default class ResetDB extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Reconstructs the database.",
            aliases: ["purgedb"],
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
        
        await SQLQuery.purgeDB()
        await SQLQuery.createDB()
        await SQLQuery.initGuild(message)

        const purgeEmbed = embeds.createEmbed()
        purgeEmbed
        .setTitle(`**ResetDB** ${discord.getEmoji("gabStare")}`)
        .setDescription("**Reconstructed the database**!")
        message.channel.send({embeds: [purgeEmbed]})
    }
}
