import {Message} from "discord.js"
import nekoClient, {NekoRequestResults} from "nekos.life"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Kitsune extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const neko = new nekoClient()

        let image: NekoRequestResults
        let title: string
        if (args[1] === "lewd") {
            if (args[2] === "ero") {
                image = await neko.nsfw.eroKitsune()
                title = "Lewd Ero Kitsune"
            } else {
                image = await neko.nsfw.kitsune()
                title = "Lewd Kitsune"
            }
        } else {
            image = await neko.sfw.foxGirl()
            title = "Kitsune"
        }

        const nekoEmbed = embeds.createEmbed()
        nekoEmbed
        .setAuthor("nekos.life", "https://avatars2.githubusercontent.com/u/34457007?s=200&v=4")
        .setURL(image.url)
        .setTitle(`**${title}** ${discord.getEmoji("madokaLewd")}`)
        .setImage(image.url)
        message.channel.send(nekoEmbed)
    }
}
