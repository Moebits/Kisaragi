import {Message} from "discord.js"
import * as lewdme from "../../assets/json/lewdme.json"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"

export default class LewdMe extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Why do you want to lewd me?",
            aliases: [],
            cooldown: 3,
            unlist: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        if (!perms.checkNSFW()) return
        const lewdmeEmbed = embeds.createEmbed()
        const random = Math.floor(Math.random() * (lewdme.pics.length - 1))
        lewdmeEmbed
        .setTitle(`**Lewd Me** ${discord.getEmoji("kisaragibawls")}`)
        .setURL(lewdme.pics[random].source)
        .setImage(lewdme.pics[random].link)
        message.channel.send(lewdmeEmbed)
        return
    }
}
