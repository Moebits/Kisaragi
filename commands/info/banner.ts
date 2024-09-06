import {Message, SlashCommandBuilder} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Kisaragi} from "../../structures/Kisaragi"

export default class Banner extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Posts the guild's banner.",
            help:
            `
            \`banner\` - Posts the guild banner
            `,
            examples:
            `
            \`=>banner\`
            `,
            guildOnly: true,
            aliases: [],
            random: "none",
            cooldown: 5,
            slashEnabled: false
        })
        this.slash = new SlashCommandBuilder()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .toJSON()
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)

        const bannerEmbed = embeds.createEmbed()
        const banner = message.guild?.bannerURL({extension: "png", size: 1024})
        if (!banner) return message.reply(`This guild has no banner ${discord.getEmoji("kannaFacepalm")}`)

        await message.channel.send({embeds: [bannerEmbed
            .setDescription(`**${message.guild!.name}'s Banner**`)
            .setURL(banner)
            .setImage(banner)]})
    }
}
