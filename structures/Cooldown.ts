import {Collection, Message} from "discord.js"
import {Embeds} from "./Embeds"
import {Kisaragi} from "./Kisaragi"

export class Cooldown {
    private readonly embeds = new Embeds(this.discord, this.message)
    constructor(private readonly discord: Kisaragi, private readonly message: Message) {}
    // Command Cooldown
    public cmdCooldown = (cmd: string, cooldown: string, cooldowns: Collection<string, Collection<string, number>>) => {
    if (!cooldowns.has(cmd)) {
        cooldowns.set(cmd, new Collection())
    }

    const now = Date.now()
    const timestamps = cooldowns.get(cmd)
    if (!timestamps) return
    const cooldownAmount = (Number(cooldown) || 3) * 1000

    if (timestamps.has(this.message.guild!.id)) {
        const expirationTime = timestamps.get(this.message.guild!.id)! + cooldownAmount

        if (now < expirationTime) {
            const cooldownEmbed = this.embeds.createEmbed()
            const timeLeft = (expirationTime - now) / 1000
            cooldownEmbed
            .setTitle(`**Command Cooldown!** ${this.discord.getEmoji("kannaHungry")}`)
            .setDescription(`${this.discord.getEmoji("star")}**${cmd}** is on cooldown! Wait **${timeLeft.toFixed(2)}** more seconds before trying again.`)
            return cooldownEmbed
        }
    }
    timestamps.set(this.message.guild!.id, now)
    setTimeout(() => {timestamps.delete(this.message.guild!.id)}, cooldownAmount)
    return null
}
}
