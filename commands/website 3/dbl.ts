import DBL from "dblapi.js"
import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"

export default class DiscordBotList extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches for bots on top.gg (discord bot list) (disabled).",
            help:
            `
            \`dbl\` - Gets a random bot.
            \`dbl query\` - Searches for bots with the query.
            `,
            examples:
            `
            \`=>dbl kisaragi\`
            `,
            aliases: ["topgg", "discordbotlist"],
            random: "none",
            cooldown: 15,
            unlist: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        return
        const dbl = new DBL(process.env.TOPGG_TOKEN!, discord)

        return
    }
}
