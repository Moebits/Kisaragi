import {assert} from "chai"
import "mocha"
import login, {cmd} from "../login"

describe("neko", async function() {
    this.beforeAll(async function() {
        await login()
    })

    it("should send an image on no params", async function() {
        assert(await cmd.assertImage(["neko"]))
    })

    it("should send a gif with gif param", async function() {
        assert(await cmd.assertImage(["neko", "gif"]))
    })

    it("should reject nsfw in non-NSFW channels", async function() {
        assert(await cmd.assertNSFW(["neko", "lewd"]))
    })

    it("should send a nsfw image with lewd param", async function() {
        assert(await cmd.assertImage(["neko", "lewd"]))
    })

    it("should send a nsfw gif with lewd param", async function() {
        assert(await cmd.assertImage(["neko", "lewd", "gif"]))
    })
})
