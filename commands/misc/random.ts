import {Message} from "discord.js"
import fs from "fs"
import {Command} from "../../structures/Command"
import {CommandFunctions} from "./../../structures/CommandFunctions"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Random extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Executes a random command, excluding permission related commands.",
            help:
            `
            \`random\` - Gets a random command
            `,
            examples:
            `
            \`=>random\`
            `,
            aliases: ["r", "rc", "rand", "randomcommand"],
            cooldown: 10,
            nsfw: true
        })
    }

    public specificCommand = async (cmd: CommandFunctions, name: string) => {
        const args: string[] = [name]
        await cmd.runCommand(this.message, args)
    }

    public randString = () => {
        const strings = [
            "anime",
            "manga",
            "gabriel dropout",
            "konosuba",
            "dragon maid",
            "azur lane",
            "kancolle",
            "kisaragi",
            "satania",
            "tohru",
            "kanna",
            "loli"
        ]
        return strings[Math.floor(Math.random()*strings.length)]
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const cmd = new CommandFunctions(discord, message)

        const commandArray: string[] = []
        const pathArray: string[] = []
        const subDir = fs.readdirSync("./commands")
        for (let i = 0; i < subDir.length; i++) {
            const commands = fs.readdirSync(`./commands/${subDir[i]}`)
            for (let j = 0; j < commands.length; j++) {
                commands[j] = commands[j].slice(0, -3)
                if (commands[j] === "empty" || commands[j] === "tempCodeRunnerFile") continue
                const cmdClass = new (require(`../${subDir[i]}/${commands[j]}`).default)(this.discord, this.message) as Command
                if (!cmdClass.options.random || cmdClass.options.random === "ignore") continue
                if (cmdClass.options.unlist) continue
                if (discord.checkMuted(message)) if (cmdClass.options.nsfw) continue
                pathArray.push(`${subDir[i]}/${commands[j]}`)
                commandArray.push(commands[j])
            }
        }
        const random = Math.floor(Math.random()*pathArray.length)
        const command = new (require(`../${pathArray[random]}`).default)(this.discord, this.message) as Command
        const name = commandArray[random]
        switch (command.options.random) {
            case "none":
                await cmd.runCommand(message, [name])
                break
            case "string":
                await cmd.runCommand(message, [name, this.randString()])
                break
            case "specific":
                await this.specificCommand(cmd, name)
                break
            default:
        }
        return
    }
}
