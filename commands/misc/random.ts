import {Message, SlashCommandBuilder} from "discord.js"
import {SlashCommandOption} from "../../structures/SlashCommandOption"
import fs from "fs"
import {Command} from "../../structures/Command"
import {CommandFunctions} from "./../../structures/CommandFunctions"
import {Embeds} from "./../../structures/Embeds"
import {Permission} from "./../../structures/Permission"
import {Kisaragi} from "./../../structures/Kisaragi"
import path from "path"

export default class Random extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
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
            slashEnabled: true
        })
        this.slash = new SlashCommandBuilder()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .toJSON()
    }

    public specificCommand = async (cmd: CommandFunctions, command: Command, name: string) => {
        const args: string[] = [name]
        await cmd.runCommandClass(command, this.message, args)
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
        const perms = new Permission(discord, message)

        const commandArray: string[] = []
        const classArray: Command[] = []
        const subDir = fs.readdirSync(path.join(__dirname, "../../commands"))
        for (let i = 0; i < subDir.length; i++) {
            const commands = fs.readdirSync(path.join(__dirname, `../../commands/${subDir[i]}`))
            for (let j = 0; j < commands.length; j++) {
                commands[j] = commands[j].slice(0, -3)
                if (commands[j] === "empty" || commands[j] === "tempCodeRunnerFile") continue
                const cmdClass = new (require(`../${subDir[i]}/${commands[j]}`).default)(this.discord, this.message) as Command
                if (!cmdClass.options.random || cmdClass.options.random === "ignore") continue
                if (cmdClass.options.unlist) continue
                if (cmdClass.options.nsfw) if (!perms.checkNSFW(true)) continue
                classArray.push(cmdClass)
                commandArray.push(commands[j])
            }
        }
        const random = Math.floor(Math.random()*classArray.length)
        const name = commandArray[random]
        const command = classArray[random]
        switch (command.options.random) {
            case "none":
                await cmd.runCommandClass(command, message, [name])
                break
            case "string":
                await cmd.runCommandClass(command, message, [name, this.randString()])
                break
            case "specific":
                await this.specificCommand(cmd, command, name)
                break
            default:
        }
        return
    }
}
