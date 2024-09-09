import {Message} from "discord.js"
import {SlashCommandSubcommand} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Dice extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Rolls a dice.",
            help:
            `
            \`dice\` - Rolls the dice.
            `,
            examples:
            `
            \`=>dice\`
            `,
            aliases: ["roll"],
            random: "none",
            cooldown: 3,
            subcommandEnabled: true
        })
        this.subcommand = new SlashCommandSubcommand()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)

        const dices = ["dice1", "dice2", "dice3", "dice4", "dice5", "dice6"]

        const roll = Math.ceil(Math.random()*6)
        const loading = message.channel.lastMessage

        const msg = await this.reply(`**Rolling the dice...** ${discord.getEmoji("diceRoll")}`)

        if (message instanceof Message) loading?.delete()
        await Functions.timeout(700)
        msg.edit(`**Rolled ${roll}!** ${discord.getEmoji(dices[roll-1])}`)
    }
}
