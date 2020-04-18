import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Kisaragi} from "../../structures/Kisaragi"

export default class Banner extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Posts the guild's banner, if there is one.",
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
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)

        const bannerEmbed = embeds.createEmbed()
        const banner = message.guild?.bannerURL({format: "png", size: 2048})
        if (!banner) return message.reply(`This guild has no banner ${discord.getEmoji("kannaFacepalm")}`)

        await message.channel.send(bannerEmbed
            .setDescription(`**${message.guild!.name}'s Banner**`)
            .setImage(banner))
    }
}
