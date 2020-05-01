import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Kisaragi} from "../../structures/Kisaragi"

export default class Splash extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Posts the guild's splash screen.",
            help:
            `
            \`splash\` - Posts the guild splash screen
            `,
            examples:
            `
            \`=>splash\`
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

        const splashEmbed = embeds.createEmbed()
        const splash = message.guild?.splashURL({format: "png", size: 2048})
        if (!splash) return message.reply(`This guild doesn't have a splash screen ${discord.getEmoji("kannaFacepalm")}`)

        await message.channel.send(splashEmbed
            .setDescription(`**${message.guild!.name}'s Splash Screen**`)
            .setURL(splash)
            .setImage(splash))
    }
}
