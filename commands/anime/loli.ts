import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

const Loli = require("lolis.life")

export default class LoliCommand extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const loli = new Loli()
        const loliEmbed = embeds.createEmbed()
        const result = (args[1] === "hentai") ? await loli.getNSFWLoli() : await loli.getSFWLoli()

        loliEmbed
        .setTitle(`**Loli** ${discord.getEmoji("madokaLewd")}`)
        .setImage(result.url)
        message.channel.send(loliEmbed)
    }
}
