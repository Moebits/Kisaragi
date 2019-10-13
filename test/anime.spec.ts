import {assert} from "chai"
import {Guild, Message} from "discord.js"
import "mocha"
import {CommandFunctions} from "./../structures/CommandFunctions"
import {Kisaragi} from "./../structures/Kisaragi"

require("dotenv").config()
const discord = new Kisaragi({restTimeOffset: 0})
let [guild, message, cmd] = [] as unknown as [Guild, Message, CommandFunctions]

describe("anime commands", async function() {
    this.beforeAll(async function() {
        await discord.login(process.env.TOKEN)
        async function ready() {
            return new Promise((resolve) => {
                discord.on("ready", () => {
                    resolve()
                })
            })
        }
        await ready()
        guild = discord.guilds.get("582230160737042480") as Guild
        message = await discord.fetchFirstMessage(guild!) as Message
        cmd = new CommandFunctions(discord, message)
    })

    it("anime: no query", async function() {
        await cmd.runCommand(message, ["anime"], true)
        assert(await cmd.assertLast("You must provide a search query."), "no query")
    })

    it("anime: invalid query", async function() {
        await cmd.runCommand(message, ["anime", "thisIsNotAnAnime"], true)
        assert(await cmd.assertLast("No results were found."), "invalid query")
    })

    it("anime: search for gabriel dropout", async function() {
        await cmd.runCommand(message, ["anime", "gabriel dropout"], true)
        assert((await cmd.assertLast("Japanese Title") && (await cmd.assertLast(true) > 1000)), "gabriel dropout")
    })
})
