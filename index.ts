import bodyParser from "body-parser"
import express from "express"
import fs from "fs"
import path from "path"
import * as config from "./config.json"
import {Kisaragi} from "./structures/Kisaragi"
import {Logger} from "./structures/Logger"
import {SQLQuery} from "./structures/SQLQuery"
const app = express()
const port = process.env.PORT || 53134

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

        const token = config.testing === "off" ? process.env.TOKEN : process.env.TEST_TOKEN
        await discord.login(token)

        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({extended: true}))

        app.get("/", async (req, res) => {
            res.setHeader("Content-Type", "text/html;charset=utf-8")
            if (req.query.code) {
                await SQLQuery.initOauth2(req.query.code)
                res.status(200).sendFile(path.join(__dirname, "../assets/html/authorized.html"))
            } else {
                res.status(200).sendFile(path.join(__dirname, "../assets/html/index.html"))
            }
        })

        app.get("*", (req, res) => {
            res.setHeader("Content-Type", "text/html;charset=utf-8")
            res.status(404).sendFile(path.join(__dirname, "../assets/html/404.html"))
        })

        app.listen(port)
        Logger.log(`Started the web server!`)

    }, 1000)
}

start()
