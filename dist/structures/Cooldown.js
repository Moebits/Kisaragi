"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Embeds_1 = require("./Embeds");
class Cooldown {
    constructor(discord, message) {
        this.discord = discord;
        this.message = message;
        this.embeds = new Embeds_1.Embeds(this.discord, this.message);
        // Command Cooldown
        this.cmdCooldown = (cmd, cooldown, msg, cooldowns) => {
            if (!cooldowns.has(cmd)) {
                cooldowns.set(cmd, new discord_js_1.Collection());
            }
            const now = Date.now();
            const timestamps = cooldowns.get(cmd);
            if (!timestamps)
                return;
            const cooldownAmount = (Number(cooldown) || 3) * 1000;
            if (timestamps.has(msg.guild.id)) {
                const expirationTime = timestamps.get(msg.guild.id) + cooldownAmount;
                if (now < expirationTime) {
                    const cooldownEmbed = this.embeds.createEmbed();
                    const timeLeft = (expirationTime - now) / 1000;
                    cooldownEmbed
                        .setTitle(`**Command Cooldown!** ${this.discord.getEmoji("kannaHungry")}`)
                        .setDescription(`${this.discord.getEmoji("star")}**${cmd}** is on cooldown! Wait **${timeLeft.toFixed(2)}** more seconds before trying again.`);
                    return cooldownEmbed;
                }
            }
            timestamps.set(msg.guild.id, now);
            setTimeout(() => { timestamps.delete(msg.guild.id); }, cooldownAmount);
            return null;
        };
    }
}
exports.Cooldown = Cooldown;
//# sourceMappingURL=Cooldown.js.map