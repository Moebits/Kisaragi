import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permissions} from "./../../structures/Permissions"

export default class IP extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const perms = new Permissions(discord, message)
        const embeds = new Embeds(discord, message)
        if (perms.checkBotDev(message)) return
        const ip = require("ip")
        const ipEmbed = embeds.createEmbed()
        const result = ip.address()
        ipEmbed
            .setTitle(`**IP Address** ${discord.getEmoji("vigneDead")}`)
            .setDescription(`My IP Address is ${result}`)
        message.channel.send(ipEmbed)

    }
}
