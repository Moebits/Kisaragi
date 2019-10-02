import {Message} from "discord.js"
import nekoClient from "nekos.life"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Slap extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const neko = new nekoClient()

        const image = await neko.sfw.slap()

        const slapEmbed = embeds.createEmbed()
        slapEmbed
        .setAuthor("nekos.life", "https://avatars2.githubusercontent.com/u/34457007?s=200&v=4")
        .setURL(image.url)
        .setTitle(`**Slap** ${discord.getEmoji("chinoSmug")}`)
        .setImage(image.url)
        message.channel.send(slapEmbed)
    }
}
