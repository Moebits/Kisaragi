import {Message} from "discord.js"
import {Embeds} from "./Embeds"
import {Kisaragi} from "./Kisaragi"
export class Haiku {
    constructor(private readonly discord: Kisaragi, private readonly message: Message) {}

    // Haiku
    public haiku = () => {
        const embeds = new Embeds(this.discord, this.message)
        const wordArray = this.message.content.replace(/\s+/g, " ").split(" ")
        const syllable = require("syllable")
        let lineCount1 = 0
        let lineCount2 = 0
        let lineCount3 = 0
        const line1: string[] = []
        const line2: string[] = []
        const line3: string[] = []
        for (let i = 0; i < wordArray.length; i++) {
            if (lineCount1 !== 5) {
                lineCount1 += syllable(wordArray[i])
                line1.push(wordArray[i])
                continue
            }
            if (lineCount1 === 5 && lineCount2 !== 7) {
                lineCount2 += syllable(wordArray[i])
                line2.push(wordArray[i])
                continue
            }
            if (lineCount2 === 7) {
                lineCount3 += syllable(wordArray[i])
                line3.push(wordArray[i])
            }
        }

        if (lineCount3 === 5) {
            const haikuEmbed = embeds.createEmbed()
            haikuEmbed
            .setTitle(`**Haiku** ${this.discord.getEmoji("vigneXD")}`)
            .setThumbnail(this.message.author!.displayAvatarURL())
            .setDescription(
                `${line1.join(" ")}\n` +
                `${line2.join(" ")}\n` +
                `${line3.join(" ")}\n` +
                "\n" +
                `**- ${this.message.author!.username}**\n`
            )
            return haikuEmbed
        }
    }
}
