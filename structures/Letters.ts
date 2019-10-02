import {GuildEmoji} from "discord.js"
import * as letters from "../letters.json"
import {Functions} from "./Functions"
import {Kisaragi} from "./Kisaragi"

export class Letters {
    constructor(private readonly discord: Kisaragi) {}
    // Parse Letters
    public letters = (text: string) => {
    const fullText: string[] = []
    for (let i = 0; i < text.length; i++) {
        fullText.push(this.getLetter(text[i])!)
    }
    const fullString = fullText.join("")
    return Functions.checkChar(fullString, 1999, "<")
}

    // Parse Emoji Letters
    public getLetter = (letter: string) => {
    if (letter === " ") return "     "
    if (letter === letter.toUpperCase()) {
        for (let i = 0; i < letters.letters.length; i++) {
            if (letters.letters[i].name === `${letter}U`) {
                const found = this.discord.emojis.find((emoji: GuildEmoji) => emoji.id === letters.letters[i].id)
                return `<:${found!.identifier}>`
            }
        }
        return letter
    }
    if (letter === letter.toLowerCase()) {
        for (let i = 0; i < letters.letters.length; i++) {
            if (letters.letters[i].name === `${letter}l`) {
                const found = this.discord.emojis.find((emoji: GuildEmoji) => emoji.id === letters.letters[i].id)
                return `<:${found!.identifier}>`
            }
        }
        return letter
    }
    if (typeof Number(letter) === "number") {
        for (let i = 0; i < letters.letters.length; i++) {
            if (letters.letters[i].name === `${letter}n`) {
                const found = this.discord.emojis.find((emoji: GuildEmoji) => emoji.id === letters.letters[i].id)
                return `<:${found!.identifier}>`
            }
        }
        return letter
    }
}
}
