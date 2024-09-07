import {Message, SlashCommandBuilder} from "discord.js"
import {Command} from "../../structures/Command"
import {CommandFunctions} from "../../structures/CommandFunctions"
import {Kisaragi} from "./../../structures/Kisaragi"
import fs from "fs"
import path from "path"

export default class Music extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Music commands",
            unlist: true,
            slashEnabled: true
        })

        const commandDir = fs.readdirSync(path.join(__dirname, "./"))

        let subcommands = [] as any

        for (let commandFile of commandDir) {
            if (!commandFile.endsWith(".ts") && !commandFile.endsWith(".js")) continue
            const commandName = commandFile.replace(".js", "").replace(".ts", "")
            if (commandName === this.constructor.name.toLowerCase()) continue

            const command = new (require(path.join(__dirname, commandFile)).default)(this.discord, this.message)

            if (command.options.subcommandEnabled) {
                subcommands.push(command.subcommand)
            }
        }

        const slashCommand = new SlashCommandBuilder()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)

        for (const subcommand of subcommands) {
            slashCommand.addSubcommand(subcommand)
        }

        this.slash = slashCommand.toJSON()
    }

    public run = async (args: string[]) => {
        const cmd = new CommandFunctions(this.discord, this.message)
        const subcommand = args[1]

        const commandDir = fs.readdirSync(path.join(__dirname, "./"))
        for (let commandFile of commandDir) {
            if (!commandFile.endsWith(".ts") && !commandFile.endsWith(".js")) continue
            const commandName = commandFile.replace(".js", "").replace(".ts", "")

            if (commandName === subcommand) {
                const command = new (require(path.join(__dirname, commandFile)).default)(this.discord, this.message)
                args.shift()
                cmd.runCommandClass(command, this.message, args)
                break
            }
        }
    }
}