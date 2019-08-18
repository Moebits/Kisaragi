import {SnowflakeUtil} from "discord.js";

exports.run = async (discord: any, message: any, args: string[]) => {

    let input = discord.combineArgs(args, 1);
    let snowflakeEmbed = discord.createEmbed();
    console.log(input.match(/\d+/g).join(""))
    console.log(input)

    if (input.match(/\d+/g).join("") === input.trim()) {
        let snowflake = SnowflakeUtil.deconstruct(input.trim());
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
        message.channel.send(snowflakeEmbed);

    } else {
        if (!input) input = Date.now();
        let snowflake = SnowflakeUtil.generate(new Date(input));
        snowflakeEmbed
        .setAuthor("discord.js", "https://discord.js.org/static/logo-square.png")
        .setTitle(`**Snowflake** ${discord.getEmoji("gabTired")}`)
        .setDescription(
            `${discord.getEmoji("star")}_Snowflake:_ **${snowflake}**\n` 
        )
        message.channel.send(snowflakeEmbed);
    }
}