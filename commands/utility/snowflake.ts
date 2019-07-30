import {SnowflakeUtil} from "discord.js";

exports.run = async (client: any, message: any, args: string[]) => {

    let input = client.combineArgs(args, 1);
    let snowflakeEmbed = client.createEmbed();
    console.log(input.match(/\d+/g).join(""))
    console.log(input)

    if (input.match(/\d+/g).join("") === input.trim()) {
        let snowflake = SnowflakeUtil.deconstruct(input.trim());
        snowflakeEmbed
        .setTitle(`**Snowflake** ${client.getEmoji("gabTired")}`)
        .setDescription(
            `${client.getEmoji("star")}_Date:_ **${snowflake.date}**\n` +
            `${client.getEmoji("star")}_Worker ID:_ **${snowflake.workerID}**\n` +
            `${client.getEmoji("star")}_Process ID:_ **${snowflake.processID}**\n` +
            `${client.getEmoji("star")}_Increment:_ **${snowflake.increment}**\n` +
            `${client.getEmoji("star")}_Binary:_ **${snowflake.binary}**\n` 
        )
        message.channel.send(snowflakeEmbed);

    } else {
        if (!input) input = Date.now();
        let snowflake = SnowflakeUtil.generate(new Date(input));
        snowflakeEmbed
        .setTitle(`**Snowflake** ${client.getEmoji("gabTired")}`)
        .setDescription(
            `${client.getEmoji("star")}_Snowflake:_ **${snowflake}**\n` 
        )
        message.channel.send(snowflakeEmbed);
    }
}