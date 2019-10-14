import {assert} from "chai"
import "mocha"
import login, {cmd} from "../login"

describe("pixiv", async function() {
    this.beforeAll(async function() {
        await login()
    })

    it("should send an image on no query", async function() {
        assert(await cmd.assertImage(["pixiv"]))
    })

    it("should send an image with a query", async function() {
        assert(await cmd.assertImage(["pixiv", "black", "tights"]))
    })

    it("should send an image with a link", async function() {
        assert(await cmd.assertImage(["pixiv", "https://www.pixiv.net/en/artworks/67790721"]))
    })

    it("should work with english tags", async function() {
        assert(await cmd.assertImage(["pixiv", "en"]))
    })

    it("should work with popular search", async function() {
        assert(await cmd.assertImage(["pixiv", "popular"]))
    })

    it("should reject r18 when not in a NSFW channel", async function() {
        assert(await cmd.assertNSFW(["pixiv", "r18"]))
    })

    it("should send an R-18 image with r18 param", async function() {
        assert(await cmd.assertImage(["pixiv", "r18"]))
    })

    it("should work with r18 popular search", async function() {
        assert(await cmd.assertImage(["pixiv", "r18", "popular"]))
    })

    it("should reject on invalid param", async function() {
        await cmd.assertReject(["pixiv", "aVeryFakePixivParam"])
    })

    it("should reject on invalid link", async function() {
        await cmd.assertReject(["pixiv", "https://www.pixiv.net/en/artworks/83493453545"])
    })
})
