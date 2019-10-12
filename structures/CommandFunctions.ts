import {Message, TextChannel} from "discord.js"
import fs from "fs"
import {Kisaragi} from "./Kisaragi"
import {SQLQuery} from "./SQLQuery"

const noCmdCool = new Set()

export class CommandFunctions {
    constructor(private readonly discord: Kisaragi, private readonly message: Message) {}

    // Run Command
    public runCommand = async (msg: Message, args: string[]) => {
        args = args.filter(Boolean)
        const path = await this.findCommand(args[0])
        if (!path) return this.noCommand(args[0])
        const cp = require(`${path}`)
        await cp.run(this.discord, msg, args).catch((err: Error) => {if (msg) msg.channel.send(this.discord.cmdError(msg, err))})
    }

    // Auto Command
    public autoCommand = async () => {
        const sql = new SQLQuery(this.message)
        const command = await sql.fetchColumn("auto", "command")
        const channel = await sql.fetchColumn("auto", "channel")
        const frequency = await sql.fetchColumn("auto", "frequency")
        const toggle = await sql.fetchColumn("auto", "toggle")
        if (!command) return
        for (let i = 0; i < command.length; i++) {
            if (toggle[0][i] === "inactive") continue
            const guildChannel = (this.message.guild!.channels.find((c) => c.id === channel[i])) as TextChannel
            const cmd = command[i].split(" ")
            const timeout = Number(frequency[i]) * 3600000
            const rawTimeLeft = await sql.fetchColumn("auto", "timeout")
            let timeLeft = 0
            if (rawTimeLeft[0]) {
                if (rawTimeLeft[i]) {
                    const remaining = (Date.now() - Number(rawTimeLeft[i])) || 0
                    timeLeft = remaining > timeout ? timeout - (remaining % timeout) : timeout - remaining
                } else {
                    rawTimeLeft[i] = Date.now().toString()
                    await sql.updateColumn("auto", "timeout", rawTimeLeft)
                    timeLeft = 0
                }
            } else {
                const timeoutArray: number[] = []
                timeoutArray.push(Date.now())
                await sql.updateColumn("auto", "timeout", timeoutArray)
                timeLeft = 0
            }
            const guildMsg = await guildChannel.messages.fetch({limit: 1}).then((m) => m.first())
            setInterval(async () => {
                await this.runCommand(guildMsg || this.message, cmd)
                timeLeft = timeout
            }, timeLeft > 0 ? timeLeft : timeout)
        }
    }

    public noCommand = async (input: string) => {
        const sql = new SQLQuery(this.message)
        if (noCmdCool.has(this.message.guild!.id)) return
        const commands = await sql.fetchColumn("commands", "command")
        for (let i = 0; i < commands.length; i++) {
            if (commands[i].includes(input)) {
                noCmdCool.add(this.message.guild!.id)
                setTimeout(() => {noCmdCool.delete(this.message.guild!.id)}, 100000)
                return this.message.reply(`This is not a command! Did you mean **${commands[i]}**?`)

            }
        }
        noCmdCool.add(this.message.guild!.id)
        setTimeout(() => {noCmdCool.delete(this.message.guild!.id)}, 100000)
        return this.message.reply(`This is not a command, type **help** for help!`)
    }

    public findCommand = async (cmd: string) => {
        let path = await SQLQuery.fetchCommand(cmd, "path")
        loop1:
        if (!path) {
            const directories = fs.readdirSync(`../commands/`)
            for (let i = 0; i < directories.length; i++) {
                const commands = fs.readdirSync(`../commands/${directories[i]}`)
                for (let j = 0; j < commands.length; j++) {
                    commands[j] = commands[j].slice(0, -3)
                    const cmdClass = new (require(`../commands/${directories[i]}/${commands[j]}.js`).default)()
                    const aliases = cmdClass.options.aliases
                    for (let k = 0; k < aliases.length; k++) {
                        if (aliases[k] === cmd) {
                            path = [`../commands/${directories[i]}/${commands[j]}.js`]
                            break loop1
                        }
                    }
                }
            }
        }
        if (!path) {
            return false
        } else {
            return path[0]
        }
    }
}
