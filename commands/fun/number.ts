import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class NumberCommand extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Guess the number!",
            help:
            `
            \`number\` - Start the number game.
            `,
            examples:
            `
            \`=>number\`
            `,
            aliases: ["number"],
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message

        const num = Math.floor(Math.random() * 1000000)

        await message.channel.send(`I picked a number! Try to guess what it is ${discord.getEmoji("raphiOMG")}`)
        const filter = (m: Message) => m.author.id === message.author.id && m.channel.id === message.channel.id

        const gameLoop = async () => {
            try {
                const collected = await message.channel.awaitMessages({filter, max: 1, time: 60000}).then((c) => c.first()?.content.trim().toLowerCase())
                if (!collected) return message.reply(`Quit, no message was sent ${discord.getEmoji("kannaFacepalm")}`)
                if (collected === "quit") {
                    return message.channel.send(`You lost the game! The correct number was **${num}** ${discord.getEmoji("smugFace")}`)
                } else if (!Number(collected)) {
                    await message.channel.send(`This is not a number! Try again. Type **quit** to give up.`)
                    return gameLoop()
                } else if (Number(collected) === num) {
                    return message.channel.send(`Congrats, you won the game! **${num}** was the correct number. ${discord.getEmoji("vigneWink")}`)
                } else if (Number(collected) < num) {
                    await message.channel.send(`That number is too small! Type **quit** to give up.`)
                    return gameLoop()
                } else if (Number(collected) > num) {
                    await message.channel.send(`That number is too big! Type **quit** to give up.`)
                    return gameLoop()
                }
            } catch {
                return message.channel.send(`Sorry, the time has run out. Quit the game.`)
            }
        }
        gameLoop()
    }
}
