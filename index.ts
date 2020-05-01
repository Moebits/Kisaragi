import fs from "fs"
import path from "path"
import * as config from "./config.json"
import Server from "./server"
import {Functions} from "./structures/Functions"
import {Kisaragi} from "./structures/Kisaragi"
import {Logger} from "./structures/Logger"
import {SQLQuery} from "./structures/SQLQuery"

let loggedIn = false

const discord = new Kisaragi({
    disableMentions: "everyone",
    restTimeOffset: 0,
    partials: ["MESSAGE", "CHANNEL", "REACTION"]
})

const dumps = [
    `../assets/images/dump`,
    `../assets/images/gifs`,
    `../assets/images/misc`,
    `../assets/images/pages`,
    `../assets/images/pixiv/illusts`,
    `../assets/images/pixiv/profiles`,
    `../assets/images/pixiv/zip`,
    `../assets/images/waifu2x`,
    `../assets/misc/dump`,
    `../assets/misc/tracks`,
    `../assets/misc/videos`,
    `./tracks/transform`,
    `./images/transform`,
    `./videos/transform`
]

for (let i = 0; i < dumps.length; i++) {
    if (!fs.existsSync(path.join(__dirname, dumps[i]))) fs.mkdirSync(path.join(__dirname, dumps[i]), {recursive: true})
}

const start = async (): Promise<void> => {
    // await SQLQuery.purgeTable("commands")
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
                await SQLQuery.insertCommand(commandName, p, command)
            } else {
                await SQLQuery.updateCommand(commandName, p, command)
            }
            commandCounter++
            Logger.log(`Loading Command: ${commandName}`)
        }))
    }

    const evtFiles = fs.readdirSync("./events/")

    evtFiles.forEach((file: string) => {
        if (!file.endsWith(".ts") && !file.endsWith(".js")) return
        const eventName = file.split(".")[0]
        Logger.log(`Loading Event: ${eventName}`)
        const event = new (require(path.join(__dirname, `./events/${eventName}`)).default)(discord)
        discord.on(eventName, (...args: any) => event.run(...args))
    })

    Logger.log(`Loaded a total of ${commandCounter} commands.`)
    Logger.log(`Loaded a total of ${evtFiles.length} events.`)

    // if (config.testing === "on") {
    const server = new Server()
    server.run()
    // }
    const token = config.testing === "off" ? process.env.TOKEN : process.env.TEST_TOKEN
    console.log("LOGGING IN")
    console.log(loggedIn)
    if (!loggedIn) await discord.login(token)
    loggedIn = true
    discord.setPfp(discord.user!.displayAvatarURL({format: "png", dynamic: true}))
    discord.setUsername(discord.user!.username)

    Functions.pollTwitch(discord)
    Functions.youtubeReSubscribe()
    if (config.testing === "off") SQLQuery.redisSet("state", JSON.stringify([]))
}

start()

// @ts-ignore
process.on("unhandledRejection", (error) => console.error(error))
process.on("uncaughtException", (error) => console.error(error))

process.on("exit", () => {
    discord.user?.setPresence({activity: {name: "Bot is restarting...", type: "WATCHING"}, status: "dnd"})
})
