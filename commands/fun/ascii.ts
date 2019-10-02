import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Ascii extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const ascii = require("ascii-art")
        const asciiEmbed = embeds.createEmbed()

        const text = Functions.combineArgs(args, 1)
        if (!text) return

        ascii.font(text, "Doom", (asciiText) => {
            asciiEmbed
            .setTitle(`**Ascii Art** ${discord.getEmoji("kannaSip")}`)
            .setDescription("```" + Functions.checkChar(asciiText, 2000, "|") + "```")
            message.channel.send(asciiEmbed)
        })
    }
}
