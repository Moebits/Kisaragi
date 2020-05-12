import {GuildEmoji, Message} from "discord.js"
import fs from "fs"
import path from "path"
import {Functions} from "./Functions"
import {Kisaragi} from "./Kisaragi"

export class Generate {
    constructor(private readonly discord: Kisaragi, private readonly message: Message) {}

    // Generate Commands and info
    public generateCommands = () => {
        let commandDesc = ""
        const commandDir = path.join(__dirname, `../commands`)
        const subDir = fs.readdirSync(commandDir)
        for (let i = 0; i < subDir.length; i++) {
            const commands = fs.readdirSync(path.join(__dirname, `../commands/${subDir[i]}`))
            commandDesc += `### ${Functions.toProperCase(subDir[i])}\n`
            for (let j = 0; j < commands.length; j++) {
                commands[j] = commands[j].slice(0, -3)
                if (commands[j] === "empty" || commands[j] === "tempCodeRunnerFile") continue
                const cmdClass = new (require(`../commands/${subDir[i]}/${commands[j]}`).default)(this.discord, this.message)
                if (cmdClass.options.unlist === true) continue
                commandDesc += `- \`${commands[j]}\`` + ` -> _${cmdClass.options.description}_\\\n`
            }
        }
        return commandDesc
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
