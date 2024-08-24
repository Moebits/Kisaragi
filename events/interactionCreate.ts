import {BaseInteraction, InteractionReplyOptions} from "discord.js"
import {Kisaragi} from "../structures/Kisaragi"
import {Command} from "../structures/Command"
import {CommandFunctions} from "../structures/CommandFunctions"
import fs from "fs"
import path from "path"

export default class InteractionCreate {
    constructor(private readonly discord: Kisaragi) {}

    public run = async (interaction: BaseInteraction) => {
        if (!interaction.isChatInputCommand()) return
        if (!interaction.channel) return
        const cmd = new CommandFunctions(this.discord, interaction as any)

        const subDir = fs.readdirSync(path.join(__dirname, "../commands"))
        for (let i = 0; i < subDir.length; i++) {
            const commands = fs.readdirSync(path.join(__dirname, `../commands/${subDir[i]}`))
            for (let j = 0; j < commands.length; j++) {
                const commandName = commands[j].slice(0, -3)

                if (commandName === interaction.commandName) {
                    const command = new (require(path.join(__dirname, `../commands/${subDir[i]}/${commands[j]}`)).default)(this.discord, interaction) as Command
                    if (!command.slash) return
                    const args = [commandName, ...interaction.options.data.map((o) => o.value)] as string[]

                    // Run the message based code with minimal changes
                    // @ts-ignore
                    interaction.author = interaction.user

                    // @ts-ignore
                    interaction.reply = ((originalReply) => {
                        return function (options: InteractionReplyOptions) {
                            if (typeof options === "string") options = {content: options}
                            // @ts-ignore
                            return originalReply.call(this, {fetchReply: true, ...options})
                        }
                    })(interaction.reply)

                    await cmd.runCommandClass(command, interaction as any, args)
                }
            }
        }
    }
}