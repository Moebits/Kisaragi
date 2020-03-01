import {Message} from "discord.js"
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
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)

        const guildIconEmbed = embeds.createEmbed()

        await message.channel.send(guildIconEmbed
            .setDescription(`**${message.guild!.name}'s Guild Icon**`)
            .setImage(message.guild!.iconURL({format: "png", size: 2048, dynamic: true})!))
    }
}
