"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
class Snowflake extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => {
            const embeds = new Embeds_1.Embeds(discord, message);
            let input = Functions_1.Functions.combineArgs(args, 1);
            const snowflakeEmbed = embeds.createEmbed();
            console.log(input.match(/\d+/g).join(""));
            console.log(input);
            if (input.match(/\d+/g).join("") === input.trim()) {
                const snowflake = discord_js_1.SnowflakeUtil.deconstruct(input.trim());
                snowflakeEmbed
                    .setAuthor("discord.js", "https://discord.js.org/static/logo-square.png")
                    .setTitle(`**Snowflake** ${discord.getEmoji("gabTired")}`)
                    .setDescription(`${discord.getEmoji("star")}_Date:_ **${snowflake.date}**\n` +
                    `${discord.getEmoji("star")}_Worker ID:_ **${snowflake.workerID}**\n` +
                    `${discord.getEmoji("star")}_Process ID:_ **${snowflake.processID}**\n` +
                    `${discord.getEmoji("star")}_Increment:_ **${snowflake.increment}**\n` +
                    `${discord.getEmoji("star")}_Binary:_ **${snowflake.binary}**\n`);
                message.channel.send(snowflakeEmbed);
            }
            else {
                if (!input)
                    input = Date.now().toString();
                const snowflake = discord_js_1.SnowflakeUtil.generate(new Date(input));
                snowflakeEmbed
                    .setAuthor("discord.js", "https://discord.js.org/static/logo-square.png")
                    .setTitle(`**Snowflake** ${discord.getEmoji("gabTired")}`)
                    .setDescription(`${discord.getEmoji("star")}_Snowflake:_ **${snowflake}**\n`);
                message.channel.send(snowflakeEmbed);
            }
        };
    }
}
exports.default = Snowflake;
//# sourceMappingURL=snowflake.js.map