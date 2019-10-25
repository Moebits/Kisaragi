import {assert} from "chai"
import "mocha"
import login, {cmd, message} from "../login"

describe("4chan", async function() {
    this.beforeAll(async function() {
        await login()
    })

    it("should search for a valid query", async function() {
        await cmd.runCommand(message, ["4chan", "a", "a"])
        assert(await cmd.assertLast("Anonymous"))
    })

    it("should work for images", async function() {
        assert(await cmd.assertImage(["4chan", "images", "c", "c"]))
    })

    it("should reject nsfw boards on non-NSFW channels", async function() {
        assert(await cmd.assertNSFW(["4chan", "h", "girl"]))
    })

    it("should reject on no query", async function() {
        assert(await cmd.assertReject(["4chan"]))
    })

    it("should reject an invalid query", async function() {
        assert (await cmd.assertReject(["4chan", "fake", "notABoard"]))
    })
})
