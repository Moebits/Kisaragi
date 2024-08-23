import {Message} from "discord.js"
import nekoClient, {NekoRequestResults} from "nekos.life"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"

export default class Kitsune extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Post a picture of a fox girl.",
            help:
            `
            \`kitsune\` - Gets a random image.
            `,
            examples:
            `
            \`=>kitsune\`
            `,
            aliases: ["k", "foxgirl"],
            random: "none",
            cooldown: 10,
            nsfw: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        const embeds = new Embeds(discord, message)
        const neko = new nekoClient()

        let image: NekoRequestResults
        let title: string
        image = await neko.foxGirl()
        title = "Kitsune"

        const nekoEmbed = embeds.createEmbed()
        nekoEmbed
        .setTitle(`**${title}** ${discord.getEmoji("madokaLewd")}`)
        .setImage(image.url)
        message.channel.send({embeds: [nekoEmbed]})
    }
}
