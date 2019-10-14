import {assert} from "chai"
import "mocha"
import login, {cmd} from "../login"

describe.only("ugoira", async function() {
    this.beforeAll(async function() {
        await login()
    })

    it("should work with a link (forwarded from pixiv command)", async function() {
        assert(await cmd.assertImage(["pixiv", "https://www.pixiv.net/en/artworks/77127472"]))
    })

    it("should send a gif with no query", async function() {
        assert(await cmd.assertImage(["ugoira"]))
    })

    it("should send a gif with a query", async function() {
        assert(await cmd.assertImage(["ugoira", "azur", "lane"]))
    })

    it("should send a gif with an english query", async function() {
        assert(await cmd.assertImage(["ugoira", "en"]))
    })

    it("should reject nsfw gifs on non-NSFW channels", async function() {
        assert(await cmd.assertNSFW(["ugoira", "r18"]))
    })

    it("should send a nsfw gif with r18 param", async function() {
        assert(await cmd.assertImage(["ugoira", "r18"]))
    })

    it("should reject an invalid query", async function() {
        assert(await cmd.assertReject(["ugoira", "aVeryFakeQuery"]))
    })

    it("should reject an invalid link", async function() {
        assert(await cmd.assertReject(["ugoira", "https://www.pixiv.net/en/artworks/34384923484"]))
    })
})
