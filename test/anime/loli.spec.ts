import {assert} from "chai"
import "mocha"
import login, {cmd} from "../login"

describe("loli", async function() {
    this.beforeAll(async function() {
        await login()
    })

    it("should send an image on no params", async function() {
        assert(await cmd.assertImage(["loli"]))
    })

    it("should reject nsfw in non-NSFW channels", async function() {
        assert(await cmd.assertNSFW(["loli", "hentai"]))
    })

    it("should send a nsfw image with hentai param", async function() {
        assert(await cmd.assertImage(["loli", "hentai"]))
    })
})
