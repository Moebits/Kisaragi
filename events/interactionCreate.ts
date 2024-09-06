import {BaseInteraction, InteractionReplyOptions} from "discord.js"
import {Kisaragi} from "../structures/Kisaragi"
import {Command} from "../structures/Command"
import {CommandFunctions} from "../structures/CommandFunctions"
import {Cooldown} from "../structures/Cooldown"
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

                    const cooldown = new Cooldown(this.discord, interaction as any)
                    const onCooldown = cooldown.cmdCooldown(commandName, command.options.cooldown)
                    if (onCooldown && (interaction.user.id !== process.env.OWNER_ID)) return interaction.reply({embeds: [onCooldown]})

                    // We override some properties to run message command based code with minimal changes
                    // @ts-expect-error
                    interaction.author = interaction.user

                    // @ts-expect-error
                    interaction.reply = ((originalReply) => {
                        return function (options: InteractionReplyOptions) {
                            if (typeof options === "string") options = {content: options}
                            return originalReply.call(this, {fetchReply: true, ...options})
                        }
                    })(interaction.reply)

                    let args = [] as string[]
                    const subcommand = interaction.options.getSubcommand()
                    if (subcommand) {
                        args = [commandName, subcommand, ...interaction.options.data[0].options!.map((o) => o.value)] as string[]
                    } else {
                        args = [commandName, ...interaction.options.data.map((o) => o.value)] as string[]
                    }
                    await cmd.runCommandClass(command, interaction as any, args)
                }
            }
        }
    }
}