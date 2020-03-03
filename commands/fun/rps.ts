import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Pickle extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Game of rock, paper, and scissors.",
            help:
            `
            \`rps rock/paper/scissors\` - Choose either rock, paper, or scissors
            \`rps r/p/s\` - Short form.
            `,
            examples:
            `
            \`=>rps paper\`
            \`=>rps rock\`
            `,
            aliases: [""],
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message

        const options = ["rock", "paper", "scissors", "r", "p", "s"]
        let choice = Functions.combineArgs(args, 1).trim()
        if (!options.includes(choice)) {
            return message.reply(`You need to choose between **rock**, **paper**, or **scissors** ${discord.getEmoji("kannaCurious")}`)
        }
        const botChoice = Math.floor(Math.random() * 3)

        if (choice === "r") choice = "rock"
        if (choice === "p") choice = "paper"
        if (choice === "s") choice = "scissors"

        let win = 0
        let userPick = ""
        const botPick = options[botChoice]
        switch (choice) {
            case "rock":
                userPick = "rock"
                if (botPick === "rock") {
                    win = 0
                } else if (botPick === "paper") {
                    win = -1
                } else {
                    win = 1
                }
                break
            case "paper":
                userPick = "paper"
                if (botPick === "rock") {
                    win = 1
                } else if (botPick === "paper") {
                    win = 0
                } else {
                    win = -1
                }
                break
            case "scissors":
                userPick = "scissors"
                if (botPick === "rock") {
                    win = -1
                } else if (botPick === "paper") {
                    win = 1
                } else {
                    win = 0
                }
                break
            default:
        }

        let str = ""
        if (win > 0) {
            str = `You won! I chose ${botPick}. **${userPick}** beats **${botPick}**. ${discord.getEmoji("triggered")}`
        } else if (win < 0) {
            str = `You lost! I chose ${botPick}. **${botPick}** beats **${userPick}**. ${discord.getEmoji("kannaDab")}`
        } else {
            str = `It's a draw... I chose **${botPick}** too. ${discord.getEmoji("raphi")}`
        }

        message.channel.send(`**Rock, Paper, Scissors** ${discord.getEmoji("miyanoTrippin")}\n` + str)
        return
    }
}
