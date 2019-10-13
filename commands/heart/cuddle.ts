import {Message} from "discord.js"
import nekoClient from "nekos.life"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Cuddle extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Posts a cuddle image.",
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const neko = new nekoClient()

        const image = await neko.sfw.cuddle()

        const cuddleEmbed = embeds.createEmbed()
        cuddleEmbed
        .setAuthor("nekos.life", "https://avatars2.githubusercontent.com/u/34457007?s=200&v=4")
        .setURL(image.url)
        .setTitle(`**Cuddle** ${discord.getEmoji("chinoSmug")}`)
        .setImage(image.url)
        message.channel.send(cuddleEmbed)
    }
}
