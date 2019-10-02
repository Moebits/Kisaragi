import {Message} from "discord.js"
import * as lewdme from "../../assets/links/lewdme.json"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class LewdMe extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public run = (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const lewdmeEmbed = embeds.createEmbed()
        const random = Math.floor(Math.random() * (lewdme.pics.length - 1))
        lewdmeEmbed
        .setTitle(`**Lewd Me** ${discord.getEmoji("kisaragibawls")}`)
        .setURL(lewdme.pics[random].source)
        .setImage(lewdme.pics[random].link)
        message.channel.send(lewdmeEmbed)
    }
}
