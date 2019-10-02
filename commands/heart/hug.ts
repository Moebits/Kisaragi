import {Message} from "discord.js"
import nekoClient from "nekos.life"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Hug extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const neko = new nekoClient()

        const image = await neko.sfw.hug()

        const hugEmbed = embeds.createEmbed()
        hugEmbed
        .setAuthor("nekos.life", "https://avatars2.githubusercontent.com/u/34457007?s=200&v=4")
        .setURL(image.url)
        .setTitle(`**Hug** ${discord.getEmoji("chinoSmug")}`)
        .setImage(image.url)
        message.channel.send(hugEmbed)
    }
}
