import {Message} from "discord.js"
import math from "mathjs"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Calc extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Calculate a math expression.",
            aliases: [],
            cooldown: 3
        })
    }

    public run = (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)

        const input = Functions.combineArgs(args, 1)
        const result = math.evaluate(input)
        const calcEmbed = embeds.createEmbed()
        calcEmbed
        .setTitle(`**Math Calculation** ${discord.getEmoji("vigneDead")}`)
        .setDescription(result)
        message.channel.send(calcEmbed)

    }
}
