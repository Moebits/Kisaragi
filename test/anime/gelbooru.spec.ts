import {assert} from "chai"
import "mocha"
import login, {cmd, message} from "../login"

describe("gelbooru", async function() {
    this.beforeAll(async function() {
        await login()
    })

    it("should send a random image on no query.", async function() {
        await cmd.runCommand(message, ["gelbooru"], true)
        assert(await cmd.assertLast(true) > 300)
    })

    it("should work with a link", async function() {
        await cmd.runCommand(message, ["gelbooru", "https://gelbooru.com/index.php?page=post&s=view&id=4788423&tags=gabriel_dropout"], true)
        assert(await cmd.assertLast("chisaki_tapris_sugarbell"))
    })

    it("should work with a query", async function() {
        await cmd.runCommand(message, ["gelbooru", "gabriel", "dropout"], true)
        assert(await cmd.assertLast(true) > 300)
    })

    it("should only run r18 commands in NSFW channels", async function() {
        assert(await cmd.assertNSFW(["gelbooru", "r18"]))
    })

    it("should send an r18 image from the query", async function() {
        await cmd.runCommand(message, ["gelbooru", "r18", "gabriel", "dropout"], true)
        assert(await cmd.assertLast(true) > 300)
    })

    it("should reject an invalid query", async function() {
        await cmd.runCommand(message, ["gelbooru", "fakeQueryAf"], true)
        assert(await cmd.assertLast("No results were found."))
    })
})
