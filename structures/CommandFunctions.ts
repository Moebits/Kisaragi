import {Message, TextChannel, ChannelType} from "discord.js"
import {Kisaragi} from "./Kisaragi"
import {SQLQuery} from "./SQLQuery"
import {Command} from "./Command"
import path from "path"

const noCmdCool = new Set()

export class CommandFunctions {
    constructor(private readonly discord: Kisaragi, private readonly message: Message<true>) {}

    // Run Command
    public runCommand = async (msg: Message<true>, args: string[], noMsg?: boolean) => {
        args = args.filter(Boolean)
        const command = this.findCommand(args?.[0])
        if (!command) return this.noCommand(args?.[0], noMsg)
        if (command.options.guildOnly) {
            // @ts-ignore
            if (msg.channel.type === ChannelType.DM) return msg.channel.send(`<@${msg.author.id}>, sorry but you can only use this command in guilds ${this.discord.getEmoji("smugFace")}`)
        }
        command.message = this.message
        let data: any
        await new Promise<void>(async (resolve, reject) => {
            await command.run(args).then((d: any) => {
                data = d
                resolve()
            })
            .catch((err: Error) => {
                if (msg) msg.channel.send({embeds: [this.discord.cmdError(msg, err)]})
                reject()
            })
        })
        return data
    }

    // Run Command (from Class)
    public runCommandClass = async (cmd: Command, msg: Message<true>, args: string[]) => {
        cmd.message = msg
        if (cmd.options.guildOnly) {
            // @ts-ignore
            if (msg.channel.type === ChannelType.DM) return msg.channel.send(`<@${msg.author.id}>, sorry but you can only use this command in guilds ${this.discord.getEmoji("smugFace")}`)
        }
        let data: any
        await new Promise<void>(async (resolve, reject) => {
            await cmd.run(args).then((d: any) => {
                data = d
                resolve()
            })
            .catch((err: Error) => {
                if (msg) msg.channel.send({embeds: [this.discord.cmdError(msg, err)]})
                reject()
            })
        })
        return data
    }

    // Auto Command
    public autoCommand = async () => {
        const sql = new SQLQuery(this.message)
        const command = await sql.fetchColumn("auto", "command")
        if (!command) return
        const channel = await sql.fetchColumn("auto", "channel")
        const frequency = await sql.fetchColumn("auto", "frequency")
        const toggle = await sql.fetchColumn("auto", "toggle")
        for (let i = 0; i < command.length; i++) {
            if (!toggle?.[i] || toggle[i] === "inactive") continue
            const guildChannel = (this.message.guild?.channels.cache.find((c) => c.id === channel[i])) as TextChannel
            if (!guildChannel) return
            const cmd = command[i].split(" ")
            const timeout = Number(frequency[i]) * 3600000
            let rawTimeLeft = await sql.fetchColumn("auto", "timeout")
            if (!rawTimeLeft) rawTimeLeft = []
            let timeLeft = timeout
            if (rawTimeLeft[i]) {
                let remaining = Number(rawTimeLeft[i])
                if (remaining <= 0) remaining = timeout
                timeLeft = remaining
            }
            const guildMsg = await guildChannel.messages.fetch({limit: 1}).then((m) => m.first())
            const update = async () => {
                let newTimeLeft = timeLeft - 60000
                if (newTimeLeft <= 0) newTimeLeft = timeout
                const toggle = await sql.fetchColumn("auto", "toggle")
                if (!toggle?.[i] || toggle?.[i] === "inactive" || newTimeLeft === timeout) return
                rawTimeLeft[i] = newTimeLeft
                await sql.updateColumn("auto", "timeout", rawTimeLeft)
                setTimeout(update, 60000)
            }
            setTimeout(update, 60000)
            const autoRun = async () => {
                if (!toggle?.[i] || toggle?.[i] === "inactive") return
                const msg = guildMsg ?? this.message
                msg.author.id = this.discord.user!.id
                await this.runCommand(msg, cmd, true)
                setTimeout(autoRun, timeout)
            }
            setTimeout(autoRun, timeLeft)
        }
    }

    public noCommand = async (input: string, noMsg?: boolean) => {
        if (noMsg || this.discord.checkMuted(this.message)) return
        if (noCmdCool.has(this.message.guild!.id)) return
        const commands = [...this.discord.commands.values()]
        for (const command of commands) {
            if (command.name.toLowerCase().includes(input.toLowerCase())) {
                noCmdCool.add(this.message.guild!.id)
                setTimeout(() => {noCmdCool.delete(this.message.guild!.id)}, 10000)
                return this.message.reply(`This is not a command! Did you mean **${command.name}**?`)
            }
        }
        noCmdCool.add(this.message.guild!.id)
        setTimeout(() => {noCmdCool.delete(this.message.guild!.id)}, 10000)
        return this.message.reply(`This is not a command, type **help** for help!`)
    }

    public findCommand = (cmd: string) => {
        let command = this.discord.commands.get(cmd)
        if (!command) {
            loop1:
            for (const parentCommand of this.discord.commands.values()) {
                const aliases = parentCommand.options.aliases
                for (const alias of aliases) {
                    if (alias === cmd) {
                        command = parentCommand
                        break loop1
                    }
                }
            }
        }
        return command
    }
}
