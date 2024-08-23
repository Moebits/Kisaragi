import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class IP extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Posts the bot's ip address.",
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        const embeds = new Embeds(discord, message)
        if (!perms.checkBotDev()) return
        const ip = require("ip")
        const ipEmbed = embeds.createEmbed()
        const result = ip.address()
        ipEmbed
            .setTitle(`**IP Address** ${discord.getEmoji("vigneDead")}`)
            .setDescription(`My IP Address is ${result}`)
        message.channel.send({embeds: [ipEmbed]})

    }
}
