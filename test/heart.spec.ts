import {discord} from "./mock"
import "mocha"

describe("heart", async function() {
    it("cuddle", async () => {
        let name = "cuddle"
        discord.resetReplyStatus()
        const command = discord.commands.get(name)!
        await command.run([name])
        if (!discord.assertReplyStatus()) throw(new Error("failed reply status"))
    })

    it("hug", async () => {
        let name = "hug"
        discord.resetReplyStatus()
        const command = discord.commands.get(name)!
        await command.run([name])
        if (!discord.assertReplyStatus()) throw(new Error("failed reply status"))
    })

    it("kiss", async () => {
        let name = "kiss"
        discord.resetReplyStatus()
        const command = discord.commands.get(name)!
        await command.run([name])
        if (!discord.assertReplyStatus()) throw(new Error("failed reply status"))
    })

    it("pat", async () => {
        let name = "pat"
        discord.resetReplyStatus()
        const command = discord.commands.get(name)!
        await command.run([name])
        if (!discord.assertReplyStatus()) throw(new Error("failed reply status"))
    })

    it("slap", async () => {
        let name = "slap"
        discord.resetReplyStatus()
        const command = discord.commands.get(name)!
        await command.run([name])
        if (!discord.assertReplyStatus()) throw(new Error("failed reply status"))
    })

    it("smug", async () => {
        let name = "smug"
        discord.resetReplyStatus()
        const command = discord.commands.get(name)!
        await command.run([name])
        if (!discord.assertReplyStatus()) throw(new Error("failed reply status"))
    })

    it("tickle", async () => {
        let name = "tickle"
        discord.resetReplyStatus()
        const command = discord.commands.get(name)!
        await command.run([name])
        if (!discord.assertReplyStatus()) throw(new Error("failed reply status"))
    })
})