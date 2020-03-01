import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Slots extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Rolls the slot machine.",
            help:
            `
            \`slots\` - Rolls the slot machine.
            `,
            examples:
            `
            \`=>slots\`
            `,
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const emojiList = ["tohruSmug", "vigneXD", "kaosWTF", "gabYes", "RaphiSmile", "PoiHug", "kannaAngry"]
        const randList = []
        for (let i = 0; i < 5; i++) {
            randList.push(emojiList[Math.floor(Math.random() * emojiList.length)])
        }
        const slotArray = []
        for (let i = 0; i < 9; i++) {
            slotArray.push(randList[Math.floor(Math.random() * 5)])
        }

        const row = Math.ceil(Math.random() * 3)
        let [a, b, c] = [0, 0, 0]
        switch (row) {
            case 1:
                  a = 0
                  b = 1
                  c = 2
                  break
            case 2:
                  a = 3
                  b = 4
                  c = 5
                  break
            case 3:
                  a = 6
                  b = 7
                  c =  8
            default:
        }
        let matches = 1
        if (slotArray[a] === slotArray[b]) {
            matches = 2
            if (slotArray[a] === slotArray[c]) {
                matches = 3
            }
        } else if (slotArray[a] === slotArray[c]) {
            matches = 2
            if (slotArray[a] === slotArray[b]) {
                matches = 3
            }
        } else if (slotArray[b] === slotArray[c]) {
            matches = 2
            if (slotArray[a] === slotArray[b]) {
                matches = 3
            }
        }

        let matchText
        switch (matches) {
            case 1:
                matchText = `**Matches: 1** ${discord.getEmoji("mexShrug")}`
                break
            case 2:
                matchText = `**Matches: 2** ${discord.getEmoji("aquaUp")}`
                break
            case 3:
                matchText = `**Matches: 3** ${discord.getEmoji("gabYes")}\n **Perfect Score!** 🎉`
            default:
        }

        const left = discord.getEmoji("left")
        await message.channel.send(`**Slot Machine** ${discord.getEmoji("KannaXD")}\n`)
        await message.channel.send(
            `${discord.getEmoji(slotArray[0])} ${discord.getEmoji(slotArray[1])} ${discord.getEmoji(slotArray[2])} ${row === 1 ? left : ""}\n` +
            `${discord.getEmoji(slotArray[3])} ${discord.getEmoji(slotArray[4])} ${discord.getEmoji(slotArray[5])} ${row === 2 ? left : ""}\n` +
            `${discord.getEmoji(slotArray[6])} ${discord.getEmoji(slotArray[7])} ${discord.getEmoji(slotArray[8])} ${row === 3 ? left : ""}\n`
        )
        return message.channel.send(matchText)
    }
}
