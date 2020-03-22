import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class $8ball extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Flips a coin.",
            help:
            `
            \`coin\` - Flips the coin.
            `,
            examples:
            `
            \`=>coin\`
            `,
            aliases: ["coinflip", "flipcoin"],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message

        const options = ["heads", "tails"]
        const choice = options[Math.floor(Math.random() * 2)]
        return message.channel.send(`Flipped **${choice}**! ${discord.getEmoji(choice)}`)
    }
}
