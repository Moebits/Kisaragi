import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Dice extends Command {
    constructor(discord: Kisaragi, message: Message) {
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
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)

        const dices = ["dice1", "dice2", "dice3", "dice4", "dice5", "dice6"]

        const roll = Math.ceil(Math.random()*6)

        const loading = message.channel.lastMessage

        const msg = await message.channel.send(
            `**Dice Roll** ${discord.getEmoji("smugFace")}\n` +
            `**Rolling the dice...** ${discord.getEmoji("diceRoll")}`)

        loading?.delete()
        await Functions.timeout(700)
        msg.edit(
            `**Dice Roll** ${discord.getEmoji("chinoSmug")}\n` +
            `**Rolled ${roll}!** ${discord.getEmoji(dices[roll-1])}`)
    }
}
