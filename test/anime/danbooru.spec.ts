import {assert} from "chai"
import "mocha"
import login, {cmd, message} from "../login"

describe("danbooru", async function() {
    this.beforeAll(async function() {
        await login()
    })

    it("should get an image on no query", async function() {
        assert(await cmd.assertImage(["danbooru"]))
    })

    it("should get an image from a link", async function() {
        await cmd.runCommand(message, ["danbooru", "https://danbooru.donmai.us/posts/3544720"], true)
        assert(await cmd.assertLast("Chisaki Tapris Sugarbell"))
    })

    it("should get an image from the query", async function() {
        await cmd.runCommand(message, ["danbooru", "tenma", "gabriel", "white"], true)
        assert(await cmd.assertLast("Tenma Gabriel White"))
    })

    it("r18 should not work in NSFW channels", async function() {
        assert(await cmd.assertNSFW(["danbooru", "r18"]))
    })

    it("should get an r18 image from a query", async function() {
        assert(await cmd.assertImage(["danbooru", "gabriel", "dropout"]))
    })

    it("should reject an invalid query", async function() {
        await cmd.assertReject(["danbooru", "fakeQueryAf"])
    })

    it("should reject an invalid url", async function() {
        await cmd.assertReject(["danbooru", "https://danbooru.donmai.us/posts/45435455342"])
    })
})
