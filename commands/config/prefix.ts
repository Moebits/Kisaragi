import {Message} from "discord.js"
import {SlashCommandSubcommand, SlashCommandOption} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Permission} from "../../structures/Permission"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Prefix extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Changes the bot prefix.",
            help:
            `
            \`prefix text\` - Sets the new prefix.
            `,
            examples:
            `
            \`=>prefix k!\`
            `,
            guildOnly: true,
            aliases: ["pref"],
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        const embeds = new Embeds(discord, message)
        if (!await perms.checkAdmin()) return

        if (!args[1]) return message.reply(`You must specify the new prefix ${discord.getEmoji("kannaCurious")}`)
        const newPrefix = args[1]

        await SQLQuery.updatePrefix(message, newPrefix)

        const prefixEmbed = embeds.createEmbed()
        prefixEmbed
        .setDescription(`The prefix has been changed to ${newPrefix}\n If you ever forget the prefix just tag me!`)
        message.channel.send({embeds: [prefixEmbed]})
        return
    }
}
