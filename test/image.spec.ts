import {discord} from "./mock"
import "mocha"

let testImage = "https://i.imgur.com/kHxuSve.jpeg"

describe("image", async function() {
    it("blur", async () => {
        let name = "blur"
        discord.resetReplyStatus()
        const command = discord.commands.get(name)!
        if (command.options.defer) command.deferReply()
        await command.run([name, "30", testImage])
        if (!discord.assertReplyStatus()) throw(new Error("failed reply status"))
    })

    it("brightness", async () => {
        let name = "brightness"
        discord.resetReplyStatus()
        const command = discord.commands.get(name)!
        if (command.options.defer) command.deferReply()
        await command.run([name, "50", testImage])
        if (!discord.assertReplyStatus()) throw(new Error("failed reply status"))
    })

    it("contrast", async () => {
        let name = "contrast"
        discord.resetReplyStatus()
        const command = discord.commands.get(name)!
        if (command.options.defer) command.deferReply()
        await command.run([name, "50", testImage])
        if (!discord.assertReplyStatus()) throw(new Error("failed reply status"))
    })

    it("crop", async () => {
        let name = "crop"
        discord.resetReplyStatus()
        const command = discord.commands.get(name)!
        if (command.options.defer) command.deferReply()
        await command.run([name, "100", "200", "200", "200", testImage])
        if (!discord.assertReplyStatus()) throw(new Error("failed reply status"))
    })

    it("flip", async () => {
        let name = "flip"
        discord.resetReplyStatus()
        const command = discord.commands.get(name)!
        if (command.options.defer) command.deferReply()
        await command.run([name, "x", testImage])
        if (!discord.assertReplyStatus()) throw(new Error("failed reply status"))
    })

    it("grayscale", async () => {
        let name = "grayscale"
        discord.resetReplyStatus()
        const command = discord.commands.get(name)!
        if (command.options.defer) command.deferReply()
        await command.run([name, testImage])
        if (!discord.assertReplyStatus()) throw(new Error("failed reply status"))
    })

    it("hue", async () => {
        let name = "hue"
        discord.resetReplyStatus()
        const command = discord.commands.get(name)!
        if (command.options.defer) command.deferReply()
        await command.run([name, "50", testImage])
        if (!discord.assertReplyStatus()) throw(new Error("failed reply status"))
    })

    it("invert", async () => {
        let name = "invert"
        discord.resetReplyStatus()
        const command = discord.commands.get(name)!
        if (command.options.defer) command.deferReply()
        await command.run([name, testImage])
        if (!discord.assertReplyStatus()) throw(new Error("failed reply status"))
    })

    it("opacity", async () => {
        let name = "opacity"
        discord.resetReplyStatus()
        const command = discord.commands.get(name)!
        if (command.options.defer) command.deferReply()
        await command.run([name, "70", testImage])
        if (!discord.assertReplyStatus()) throw(new Error("failed reply status"))
    })

    it.skip("photoshop", async () => {
        let name = "photoshop"
        discord.resetReplyStatus()
        const command = discord.commands.get(name)!
        if (command.options.defer) command.deferReply()
        await command.run([name])
        if (!discord.assertReplyStatus()) throw(new Error("failed reply status"))
    })

    it("pixelate", async () => {
        let name = "pixelate"
        discord.resetReplyStatus()
        const command = discord.commands.get(name)!
        if (command.options.defer) command.deferReply()
        await command.run([name, "7", testImage])
        if (!discord.assertReplyStatus()) throw(new Error("failed reply status"))
    })

    it("posterize", async () => {
        let name = "posterize"
        discord.resetReplyStatus()
        const command = discord.commands.get(name)!
        if (command.options.defer) command.deferReply()
        await command.run([name, "10", testImage])
        if (!discord.assertReplyStatus()) throw(new Error("failed reply status"))
    })

    it("resize", async () => {
        let name = "resize"
        discord.resetReplyStatus()
        const command = discord.commands.get(name)!
        if (command.options.defer) command.deferReply()
        await command.run([name, "500", "700", testImage])
        if (!discord.assertReplyStatus()) throw(new Error("failed reply status"))
    })

    it("saturation", async () => {
        let name = "saturation"
        discord.resetReplyStatus()
        const command = discord.commands.get(name)!
        if (command.options.defer) command.deferReply()
        await command.run([name, "50", testImage])
        if (!discord.assertReplyStatus()) throw(new Error("failed reply status"))
    })

    it("scale", async () => {
        let name = "scale"
        discord.resetReplyStatus()
        const command = discord.commands.get(name)!
        if (command.options.defer) command.deferReply()
        await command.run([name, "1.5", testImage])
        if (!discord.assertReplyStatus()) throw(new Error("failed reply status"))
    })

    it("sepia", async () => {
        let name = "sepia"
        discord.resetReplyStatus()
        const command = discord.commands.get(name)!
        if (command.options.defer) command.deferReply()
        await command.run([name, testImage])
        if (!discord.assertReplyStatus()) throw(new Error("failed reply status"))
    })

    it("sharpen", async () => {
        let name = "sharpen"
        discord.resetReplyStatus()
        const command = discord.commands.get(name)!
        if (command.options.defer) command.deferReply()
        await command.run([name, "5", "5", testImage])
        if (!discord.assertReplyStatus()) throw(new Error("failed reply status"))
    })

    it("tint", async () => {
        let name = "tint"
        discord.resetReplyStatus()
        const command = discord.commands.get(name)!
        if (command.options.defer) command.deferReply()
        await command.run([name, "#ff5ce1", "60", testImage])
        if (!discord.assertReplyStatus()) throw(new Error("failed reply status"))
    })

    it("value", async () => {
        let name = "value"
        discord.resetReplyStatus()
        const command = discord.commands.get(name)!
        if (command.options.defer) command.deferReply()
        await command.run([name, "50", testImage])
        if (!discord.assertReplyStatus()) throw(new Error("failed reply status"))
    })

    it.skip("waifu2x", async () => {
        let name = "waifu2x"
        discord.resetReplyStatus()
        const command = discord.commands.get(name)!
        if (command.options.defer) command.deferReply()
        await command.run([name, "cugan", testImage])
        if (!discord.assertReplyStatus()) throw(new Error("failed reply status"))
    })
})