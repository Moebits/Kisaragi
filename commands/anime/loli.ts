import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"

const Loli = require("lolis.life")

export default class LoliCommand extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Posts a random loli image.",
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        const loli = new Loli()
        const loliEmbed = embeds.createEmbed()
        let result
        if (args[1] === "hentai") {
            if (!perms.checkNSFW()) return
            result = await loli.getNSFWLoli()
        } else {
             result = await loli.getSFWLoli()
        }

        loliEmbed
        .setTitle(`**Loli** ${discord.getEmoji("madokaLewd")}`)
        .setImage(result.url)
        message.channel.send(loliEmbed)
    }
}
