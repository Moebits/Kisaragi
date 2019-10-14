import {assert} from "chai"
import "mocha"
import login, {cmd, message} from "../login"

describe("yandere", async function() {
    this.beforeAll(async function() {
        await login()
    })

    it("should send an image on no query.", async function() {
        assert(await cmd.assertImage(["yandere"]))
    })

    it("should work with a link", async function() {
        await cmd.runCommand(message, ["yandere", "https://yande.re/post/show/579170"])
        assert(await cmd.assertLast("azur_lane"))
    })

    it("should work with a query", async function() {
        assert(await cmd.assertImage(["yandere", "gabriel", "dropout"]))
    })

    it("should only run r18 commands in NSFW channels", async function() {
        assert(await cmd.assertNSFW(["yandere", "r18"]))
    })

    it("should send an r18 image from a query", async function() {
        assert(await cmd.assertImage(["yandere", "r18", "gabriel", "dropout"]))
    })

    it("should reject an invalid query", async function() {
        await cmd.assertReject(["yandere", "fakeQueryAf"])
    })

    it("should reject an invalid url", async function() {
        await cmd.assertReject(["yandere", "https://yande.re/post/show/534543545"])
    })

})
