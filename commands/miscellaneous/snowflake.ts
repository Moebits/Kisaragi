import {Message, SnowflakeUtil} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Snowflake extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)

        let input = Functions.combineArgs(args, 1)
        const snowflakeEmbed = embeds.createEmbed()
        console.log(input.match(/\d+/g)!.join(""))
        console.log(input)

        if (input.match(/\d+/g)!.join("") === input.trim()) {
            const snowflake = SnowflakeUtil.deconstruct(input.trim())
            snowflakeEmbed
            .setAuthor("discord.js", "https://discord.js.org/static/logo-square.png")
            .setTitle(`**Snowflake** ${discord.getEmoji("gabTired")}`)
            .setDescription(
                `${discord.getEmoji("star")}_Date:_ **${snowflake.date}**\n` +
                `${discord.getEmoji("star")}_Worker ID:_ **${snowflake.workerID}**\n` +
                `${discord.getEmoji("star")}_Process ID:_ **${snowflake.processID}**\n` +
                `${discord.getEmoji("star")}_Increment:_ **${snowflake.increment}**\n` +
                `${discord.getEmoji("star")}_Binary:_ **${snowflake.binary}**\n`
            )
            message.channel.send(snowflakeEmbed)

        } else {
            if (!input) input = Date.now().toString()
            const snowflake = SnowflakeUtil.generate(new Date(input))
            snowflakeEmbed
            .setAuthor("discord.js", "https://discord.js.org/static/logo-square.png")
            .setTitle(`**Snowflake** ${discord.getEmoji("gabTired")}`)
            .setDescription(
                `${discord.getEmoji("star")}_Snowflake:_ **${snowflake}**\n`
            )
            message.channel.send(snowflakeEmbed)
        }
    }
}
