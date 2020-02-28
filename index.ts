import {WSEventType} from "discord.js"
import * as fs from "fs"
import {Kisaragi} from "./structures/Kisaragi"
import {Logger} from "./structures/Logger"
import {SQLQuery} from "./structures/SQLQuery"

const discord = new Kisaragi({
    disableEveryone: true,
    restTimeOffset: 0,
    disabledEvents: ["TYPING_START", "TYPING_STOP"] as WSEventType[]
})

const start = async (): Promise<void> => {

    const cmdFiles: string[][] = []
    const subDirectory = fs.readdirSync("./commands/")

    for (let i = 0; i < subDirectory.length; i++) {
        const currDir = subDirectory[i]
        const addFiles = fs.readdirSync(`./commands/${currDir}`)
        if (addFiles !== null) cmdFiles.push(addFiles)

        await Promise.all(addFiles.map(async (file: string) => {
            if (!file.endsWith(".ts") && !file.endsWith(".js")) return
            const path = `../commands/${currDir}/${file}`
            const commandName = file.split(".")[0]
            if (commandName === "empty" || commandName === "tempCodeRunnerFile") return
            const cmdFind = await SQLQuery.fetchCommand(commandName, "command")
            const command = new (require(`./commands/${currDir}/${file}`).default)(discord, null)

            if (!cmdFind) {
                await SQLQuery.insertCommand(commandName, command.aliases, path, command.cooldown)
            } else {
                await SQLQuery.updateCommand(commandName, command.aliases, command.cooldown)
            }
            Logger.log(`Loading Command: ${commandName}`)
        }))
    }

    setTimeout(async () => {

        const evtFiles = fs.readdirSync("./events/")

        evtFiles.forEach((file: string) => {
            if (!file.endsWith(".ts") && !file.endsWith(".js")) return
            const eventName = file.split(".")[0]
            Logger.log(`Loading Event: ${eventName}`)
            const event = new (require(`./events/${eventName}.js`).default)(discord)
            discord.on(eventName, (...args: any) => event.run(...args))
        })

        Logger.log(`Loaded a total of ${cmdFiles.length} commands.`)
        Logger.log(`Loaded a total of ${evtFiles.length} events.`)

        await discord.login(process.env.TOKEN)

    }, 1000)
}

start()
