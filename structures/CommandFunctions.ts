import {Message, TextChannel} from "discord.js"
import {Kisaragi} from "./Kisaragi"
import {SQLQuery} from "./SQLQuery"

const noCmdCool = new Set()

export class CommandFunctions {
    constructor(private readonly discord: Kisaragi) {}

    // Run Command
    public runCommand = async (message: Message, args: string[]) => {
        args = args.filter(Boolean)
        const path = await this.findCommand(args[0])
        if (!path) return this.noCommand(message, args[0])
        const cp = require(`${path}`)
        await cp.run(this.discord, message, args).catch((err: Error) => {if (message) message.channel.send(this.discord.cmdError(message, err))})
    }

    // Auto Command
    public autoCommand = async (message: Message) => {
        const sql = new SQLQuery(message)
        const command = await sql.fetchColumn("auto", "command")
        const channel = await sql.fetchColumn("auto", "channel")
        const frequency = await sql.fetchColumn("auto", "frequency")
        const toggle = await sql.fetchColumn("auto", "toggle")
        if (!command) return
        for (let i = 0; i < command.length; i++) {
            if (toggle[0][i] === "inactive") continue
            const guildChannel = (message.guild!.channels.find((c) => c.id === channel[i])) as TextChannel
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
                await this.runCommand(guildMsg || message, cmd)
                timeLeft = timeout
            }, timeLeft > 0 ? timeLeft : timeout)
        }
    }

    public noCommand = async (message: Message, input: string) => {
        const sql = new SQLQuery(message)
        if (noCmdCool.has(message.guild!.id)) return
        const commands = await sql.fetchColumn("commands", "command")
        for (let i = 0; i < commands.length; i++) {
            if (commands[i].includes(input)) {
                noCmdCool.add(message.guild!.id)
                setTimeout(() => {noCmdCool.delete(message.guild!.id)}, 100000)
                return message.reply(`This is not a command! Did you mean **${commands[i]}**?`)

            }
        }
        noCmdCool.add(message.guild!.id)
        setTimeout(() => {noCmdCool.delete(message.guild!.id)}, 100000)
        return message.reply(`This is not a command, type **help** for help!`)
    }

    public findCommand = async (cmd: string) => {
        const commands = require("../commands.json")
        let path = await SQLQuery.fetchCommand(cmd, "path")
        if1:
        if (!path) {
            for (const i in commands) {
                for (const j in commands[i].aliases) {
                    if (commands[i] .aliases[j] === cmd) {
                        cmd = commands[i].name
                        path = await SQLQuery.fetchCommand(cmd, "path")
                        break if1
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
