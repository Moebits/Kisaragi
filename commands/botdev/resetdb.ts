import {Message} from "discord.js"
import {SlashCommandSubcommand, SlashCommandOption} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "../../structures/Embeds"
import {Kisaragi} from "../../structures/Kisaragi"
import {SQLQuery} from "../../structures/SQLQuery"

export default class ResetDB extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Reconstructs the database.",
            help:
            `
            \`resetdb\` - Reset the database
            `,
            examples:
            `
            \`=>resetdb\`
            `,
            aliases: ["purgedb"],
            cooldown: 3,
            botdev: true,
            subcommandEnabled: true
        })
        this.subcommand = new SlashCommandSubcommand()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
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
        this.reply(purgeEmbed)
    }
}
