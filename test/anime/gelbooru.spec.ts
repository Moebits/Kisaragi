import {assert} from "chai"
import "mocha"
import login, {cmd, message} from "../login"

describe("gelbooru", async function() {
    this.beforeAll(async function() {
        await login()
    })

    it("should send an image on no query.", async function() {
        assert(await cmd.assertImage(["gelbooru"]))
    })

    it("should work with a link", async function() {
        await cmd.runCommand(message, ["gelbooru", "https://gelbooru.com/index.php?page=post&s=view&id=4788423&tags=gabriel_dropout"])
        assert(await cmd.assertLast("chisaki_tapris_sugarbell"))
    })

    it("should work with a query", async function() {
        assert(await cmd.assertImage(["gelbooru", "gabriel", "dropout"]))
    })

    it("should only run r18 commands in NSFW channels", async function() {
        assert(await cmd.assertNSFW(["gelbooru", "r18"]))
    })

    it("should send an r18 image from a query", async function() {
        assert(await cmd.assertImage(["gelbooru", "r18", "gabriel", "dropout"]))
    })

    it("should reject an invalid query", async function() {
        await cmd.assertReject(["gelbooru", "fakeQueryAf"])
    })

    it("should reject an invalid url", async function() {
        await cmd.assertReject(["gelbooru", "https://gelbooru.com/index.php?page=post&s=view&id=23423423432"])
    })
})
