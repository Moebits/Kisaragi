import {Message, SlashCommandSubcommandBuilder} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Coin extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
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
            cooldown: 3,
            subcommandEnabled: true
        })
        this.subcommand = new SlashCommandSubcommandBuilder()
        .setName(this.constructor.name.toLowerCase())
        .setDescription(this.options.description)
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message

        const options = ["heads", "tails"]
        const choice = options[Math.floor(Math.random() * 2)]
        return message.reply(`Flipped **${choice}**! ${discord.getEmoji(choice)}`)
    }
}
