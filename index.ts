import fs from "fs"
import path from "path"
import {Kisaragi} from "./structures/Kisaragi"
import {Logger} from "./structures/Logger"
import {SQLQuery} from "./structures/SQLQuery"

const discord = new Kisaragi({
    disableMentions: "everyone",
    restTimeOffset: 0
})

const start = async (): Promise<void> => {
    let commandCounter = 0
    const cmdFiles: string[][] = []
    const subDirectory = fs.readdirSync(path.join(__dirname, "./commands/"))

    for (let i = 0; i < subDirectory.length; i++) {
        const currDir = subDirectory[i]
        const addFiles = fs.readdirSync(path.join(__dirname, `./commands/${currDir}`))
        if (addFiles !== null) cmdFiles.push(addFiles)

        await Promise.all(addFiles.map(async (file: string) => {
            if (!file.endsWith(".ts") && !file.endsWith(".js")) return
            const p = `../commands/${currDir}/${file}`
            const commandName = file.split(".")[0]
            if (commandName === "empty" || commandName === "tempCodeRunnerFile") return
            const cmdFind = await SQLQuery.fetchCommand(commandName, "command")
            const command = new (require(path.join(__dirname, `./commands/${currDir}/${file}`)).default)(discord, null)

            if (!cmdFind) {
                await SQLQuery.insertCommand(commandName, command.aliases, p, command.cooldown)
            } else {
                await SQLQuery.updateCommand(commandName, command.aliases, command.cooldown)
            }
            commandCounter++
            Logger.log(`Loading Command: ${commandName}`)
        }))
    }

    setTimeout(async () => {

        const evtFiles = fs.readdirSync("./events/")

        evtFiles.forEach((file: string) => {
            if (!file.endsWith(".ts") && !file.endsWith(".js")) return
            const eventName = file.split(".")[0]
            Logger.log(`Loading Event: ${eventName}`)
            const event = new (require(path.join(__dirname, `./events/${eventName}.js`)).default)(discord)
            discord.on(eventName, (...args: any) => event.run(...args))
        })

        Logger.log(`Loaded a total of ${commandCounter} commands.`)
        Logger.log(`Loaded a total of ${evtFiles.length} events.`)

        await discord.login(process.env.TOKEN)

    }, 1000)
}

start()
