import {GuildEmoji} from "discord.js"
import {Kisaragi} from "./Kisaragi"

export class Generate {
    constructor(private readonly discord: Kisaragi) {}

    // Generate Commands for commands.json
    public generateCommands = (cmdFiles: string[]) => {
        const newFiles = cmdFiles.flat(Infinity)
        const addedFiles: string[] = []
        loop1:
        for (let i = 0; i < newFiles.length; i++) {
            const commandName = newFiles[i].split(".")[0]
            for (let j = 0; j < addedFiles.length; j++) {
                if (addedFiles[j] === commandName) {
                    continue loop1
                }
            }
            addedFiles.push(commandName)
            console.log(`"${commandName}": {"name": "${commandName}", "aliases": [], "cooldown": ""},`)
        }
    }

    // Generate Emojis for config.json
    public generateEmojis = (letterNames: string[]) => {
        for (let i = 0; i < letterNames.length; i++) {
            this.discord.emojis.cache.map((emoji: GuildEmoji) => {
                if (emoji.name === letterNames[i]) {
                    console.log(`{"name": "${letterNames[i]}", "id": "${emoji.id}"},`)
                }
            })
        }
    }
}
