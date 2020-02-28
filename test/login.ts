import {Guild, Message} from "discord.js"
import {CommandFunctions} from "../structures/CommandFunctions"
import {Kisaragi} from "../structures/Kisaragi"

require("dotenv").config()
const discord = new Kisaragi({restTimeOffset: 0})
let [guild, message, cmd] = [] as unknown as [Guild, Message, CommandFunctions]
async function start() {
    await discord.login(process.env.TOKEN)
    async function ready() {
            return new Promise((resolve) => {
                discord.on("ready", () => {
                    resolve()
                })
            })
        }
    await ready()
    guild = discord.guilds.cache.get("582230160737042480") as Guild
    message = await discord.fetchFirstMessage(guild!) as Message
    cmd = new CommandFunctions(discord, message)
}

export default async () => {
    if (!message || !cmd) await start()
}

export {message, cmd}
