import {assert} from "chai"
import "mocha"
import login, {cmd, message} from "../login"

describe("danbooru", async function() {
    this.beforeAll(async function() {
        await login()
    })

    it("should get a random image on no query", async function() {
        await cmd.runCommand(message, ["danbooru"], true)
        assert(await cmd.assertLast(true) > 300)
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

    it("should get an r18 image from the query", async function() {
        await cmd.runCommand(message, ["danbooru", "gabriel", "dropout"], true)
        assert(await cmd.assertLast(true) > 300)
    })

    it("should reject an invalid query", async function() {
        await cmd.runCommand(message, ["danbooru", "fakeQueryAf"], true)
        assert(await cmd.assertLast("No results were found."))
    })
})
