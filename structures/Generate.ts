import {GuildEmoji, Message} from "discord.js"
import fs from "fs"
import path from "path"
import {Functions} from "./Functions"
import {Kisaragi} from "./Kisaragi"

class Dummy {
    constructor() {}
    public getEmoji = () => null
}

export class Generate {
    constructor(private readonly discord: Kisaragi, private readonly message: Message) {}

    /*Generate Command JSON file*/
    public static generateJSON = () => {
        const commandArray: any = []
        const commandDir = path.join(__dirname, `../commands`)
        const subDir = fs.readdirSync(commandDir)
        for (let i = 0; i < subDir.length; i++) {
            const commands = fs.readdirSync(path.join(__dirname, `../commands/${subDir[i]}`))
            for (let j = 0; j < commands.length; j++) {
                commands[j] = commands[j].slice(0, -3)
                if (commands[j] === "empty" || commands[j] === "tempCodeRunnerFile") continue
                const cmdClass = new (require(`../commands/${subDir[i]}/${commands[j]}`).default)(new Dummy(), null)
                if (cmdClass.options.unlist === true) continue
                const commandObj: any = {}
                commandObj.command = commands[j]
                commandObj.category = subDir[i]
                if (subDir[i] === "japanese") commandObj.category = "weeb"
                commandObj.description = cmdClass.options.description
                commandObj.help = Functions.multiTrim(cmdClass.options.help).replace(/`/g, "")
                commandObj.aliases = cmdClass.options.aliases?.[0] ? cmdClass.options.aliases.join(", ") : "none"
                commandObj.examples = Functions.multiTrim(cmdClass.options.examples).replace(/`/g, "")
                commandObj.cooldown = cmdClass.options.cooldown
                commandArray.push(commandObj)
            }
        }
        const json = JSON.stringify(commandArray, null, 4)
        fs.writeFileSync(path.join(__dirname, `../../assets/json/commands.json`), json)
        console.log("done")
    }

    // Generate Commands and info
    public generateCommands = () => {
        let commandDesc = ""
        const commandDir = path.join(__dirname, `../commands`)
        const subDir = fs.readdirSync(commandDir)
        for (let i = 0; i < subDir.length; i++) {
            const commands = fs.readdirSync(path.join(__dirname, `../commands/${subDir[i]}`))
            commandDesc += `### ${Functions.toProperCase(subDir[i])}\n`
            for (let j = 0; j < commands.length; j++) {
                commands[j] = commands[j].slice(0, -3)
                if (commands[j] === "empty" || commands[j] === "tempCodeRunnerFile") continue
                const cmdClass = new (require(`../commands/${subDir[i]}/${commands[j]}`).default)(this.discord, this.message)
                if (cmdClass.options.unlist === true) continue
                commandDesc += `- \`${commands[j]}\`` + ` -> _${cmdClass.options.description}_\\\n`
            }
        }
        return commandDesc
    }

    // Generate Emojis for config.json
    public generateEmojis = (letterNames: string[]) => {
        for (let i = 0; i < letterNames.length; i++) {
            this.discord.emojis.cache.map((emoji: GuildEmoji) => {
                if (emoji.name === letterNames[i]) {
                    console.log(`{"name": "${letterNames[i]}", "id": "${emoji.id}"},`)
                }
            })
        }
    }

    public static generateIconJSON = () => {
        const iconJSON = {}
        const commandDir = path.join(__dirname, `../commands`)
        const categories = fs.readdirSync(commandDir)
        loop1:
        for (const category of categories) {
            const commands = fs.readdirSync(path.join(__dirname, `../commands/${category}`))
            for (const command of commands) {
                const commandName = path.basename(command, path.extname(command))
                const fileStr = fs.readFileSync(path.join(__dirname, `../commands/${category}/${command}`)).toString()
                const regex = /(?<=.setAuthor.*iconURL: ")(https?.*?)(?=")/g
                const matches = fileStr.match(regex)
                if (matches) {
                    iconJSON[commandName] = Functions.removeDuplicates(matches)
                }
            }
        }
        const json = JSON.stringify(iconJSON, null, 4)
        fs.writeFileSync(path.join(__dirname, `../../assets/icons.json`), json)
        console.log("done")
    }

    public static downloadIcons = async () => {
        const json = JSON.parse(fs.readFileSync(path.join(__dirname, `../../assets/icons.json`)).toString())
        for (const [key, values] of Object.entries(json)) {
            try {
                let i = 0
                // @ts-ignore
                for (const value of values) {
                    let apppend = i === 0 ? "" : `${i}`
                    const dest = path.join(__dirname, `../../assets/icons/${key}${apppend}.png`)
                    const arrayBuffer = await fetch(String(value)).then((r) => r.arrayBuffer())
                    fs.writeFileSync(dest, Buffer.from(arrayBuffer))
                    i++
                }
            } catch {
                console.log(key)
                console.log(values)
            }
        }
        console.log("done")
    }

    public static downloadBanners = async () => {
        const imageMap = {
            "admin": "https://i.imgur.com/mMXKOPW.png",
            "anime": "https://i.imgur.com/JvuBhSL.png",
            "botdev": "https://i.imgur.com/pc9syrB.png",
            "config": "https://i.imgur.com/wWolBwY.png",
            "fun": "https://i.imgur.com/lTRD9J0.png",
            "game": "https://i.imgur.com/WCbOnxm.png",
            "heart": "https://i.imgur.com/UC8XPVE.png",
            "booru": "https://i.imgur.com/YWD2zg1.png",
            "info": "https://i.imgur.com/BR5OtIE.png",
            "weeb": "https://i.imgur.com/7DpFyuL.png",
            "level": "https://i.imgur.com/fxLI1df.png",
            "image": "https://i.imgur.com/eR3k5Ur.png",
            "misc": "https://i.imgur.com/Rd9U6tc.png",
            "misc 2": "https://i.imgur.com/0ol5ajZ.png",
            "mod": "https://i.imgur.com/x3Y108l.png",
            "music": "https://i.imgur.com/eZ2IphP.png",
            "music 2": "https://i.imgur.com/fADrzzB.png",
            "music 3": "https://i.imgur.com/nKRy0NA.png",
            "reddit": "https://i.imgur.com/RxYtvDD.png",
            "twitter": "https://i.imgur.com/u19rOTB.png",
            "video": "https://i.imgur.com/qqUFolE.png",
            "waifu": "https://i.imgur.com/t5P05XQ.png",
            "website": "https://i.imgur.com/ftVh8jx.png",
            "website 2": "https://i.imgur.com/0bUmQ7F.png",
            "website 3": "https://i.imgur.com/CMm9fZy.png"
        }
        for (const [key, value] of Object.entries(imageMap)) {
            const dest = path.join(__dirname, `../../assets/icons/${key}.png`)
            const buffer = await fetch(value).then((r) => r.arrayBuffer())
            fs.writeFileSync(dest, Buffer.from(buffer))
        }
        console.log("done")
    }

    public static replaceURLS = async () => {
        const json = JSON.parse(fs.readFileSync(path.join(__dirname, `../../assets/icons.json`)).toString())
        const commandDir = path.join(__dirname, `../../commands`)
        const categories = fs.readdirSync(commandDir)
        loop1:
        for (const category of categories) {
            if (category === ".DS_Store") continue
            const commands = fs.readdirSync(path.join(__dirname, `../../commands/${category}`))
            for (const command of commands) {
                if (command === ".DS_Store") continue
                const commandName = path.basename(command, path.extname(command))
                if (!json[commandName]) continue
                const pathname = path.join(__dirname, `../../commands/${category}/${command}`)
                const fileStr = fs.readFileSync(pathname).toString()
                const newURL = `https://kisaragi.moe/assets/embed/${commandName}.png`
                const toReplace = json[commandName][0]
                const newStr = fileStr.replaceAll(toReplace, newURL)
                console.log(newStr)
                break loop1 
            }
        }
        console.log("done")

    }
}
