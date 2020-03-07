import {Message, SnowflakeUtil} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Snowflake extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Deconstructs or generates a discord snowflake.",
            help:
            `
            \`snowflake flake\` - Deconstructs the snowflake
            \`snowflake date?\` - Generates a snowflake for the current time (or date, if provided)
            `,
            examples:
            `
            \`=>snowflake\`
            \`=>snowflake 579720679612612608\`
            `,
            aliases: [],
            random: "none",
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)

        const input = Functions.combineArgs(args, 1)
        const snowflakeEmbed = embeds.createEmbed()

        if (input && (input.match(/\d+/g)?.join("") === input.trim())) {
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
            const snowflake = SnowflakeUtil.generate(input.trim() ? new Date(input) : Date.now())
            snowflakeEmbed
            .setAuthor("discord.js", "https://discord.js.org/static/logo-square.png")
            .setTitle(`**Snowflake** ${discord.getEmoji("gabTired")}`)
            .setDescription(
                `${discord.getEmoji("star")}_Snowflake:_ **${snowflake}**\n`
            )
            return message.channel.send(snowflakeEmbed)
        }
    }
}
