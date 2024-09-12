import {Message} from "discord.js"
import {SlashCommandSubcommand, SlashCommandOption} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Kisaragi} from "../../structures/Kisaragi"

export default class GuildIcon extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Posts the guild's icon.",
            help:
            `
            \`icon\` - Posts the guild icon
            `,
            examples:
            `
            \`=>icon\`
            `,
            guildOnly: true,
            aliases: ["gicon", "guildicon"],
            random: "none",
            cooldown: 5,
            subcommandEnabled: true
        })
        this.subcommand = new SlashCommandSubcommand()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)

        const guildIconEmbed = embeds.createEmbed()
        const icon = message.guild?.iconURL({extension: "png", size: 1024})
        if (!icon) return this.reply(`This guild doesn't have an icon ${discord.getEmoji("kannaFacepalm")}`)

        await this.reply(guildIconEmbed
            .setDescription(`**${message.guild!.name}'s Icon**`)
            .setURL(icon)
            .setImage(icon))
    }
}
