import {Message, SlashCommandBuilder} from "discord.js"
import {Command} from "../../structures/Command"
import {CommandFunctions} from "../../structures/CommandFunctions"
import {Kisaragi} from "../../structures/Kisaragi"
import fs from "fs"
import path from "path"

export default class Music2Slash extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Music 2 commands",
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
            .setName(this.constructor.name.toLowerCase().replace("slash", ""))
            .setDescription(this.options.description)

        for (const subcommand of subcommands) {
            slashCommand.addSubcommand(subcommand)
        }

        this.slash = slashCommand.toJSON()
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const cmd = new CommandFunctions(this.discord, this.message)
        const subcommand = args[1]

        const command = discord.commands.get(subcommand)
        if (!command) return
        args.shift()
        command.message = message
        cmd.runCommandClass(command, this.message, args)
    }
}