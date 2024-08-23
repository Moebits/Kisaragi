import {Message, SlashCommandBuilder} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Chat extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Connects or disconnects to the global chat.",
            help:
            `
            _Note: Messages cannot exceed 100 characters, and 1 message per 3 seconds._
            \`chat\` - Connects or disconnects to the global chat
            `,
            examples:
            `
            \`=>chat\`
            `,
            aliases: ["globalchat", "gchat"],
            cooldown: 3,
            guildOnly: true,
            slashEnabled: true
        })
        this.slash = new SlashCommandBuilder()
        .setName(this.constructor.name.toLowerCase())
        .setDescription(this.options.description)
        .setDMPermission(false)
        .toJSON()
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const sql = new SQLQuery(message)

        if (discord.checkMuted(message)) return message.reply(`This server was blacklisted on the global`)

        const channel = await sql.fetchColumn("guilds", "global chat")
        if (!channel) {
            await sql.updateColumn("guilds", "global chat", message.channel.id)
            return message.reply(`You are now connected to the global chat! ${discord.getEmoji("tohruSmug")}`)
        } else {
            await sql.updateColumn("guilds", "global chat", null)
            return message.reply(`Disconnected from the global chat! ${discord.getEmoji("mexShrug")}`)
        }
    }
}
