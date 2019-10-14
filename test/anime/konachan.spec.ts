import {assert} from "chai"
import "mocha"
import login, {cmd, message} from "../login"

describe("konachan", async function() {
    this.beforeAll(async function() {
        await login()
    })

    it("should send an image on no query.", async function() {
        assert(await cmd.assertImage(["konachan"]))
    })

    it("should work with a link", async function() {
        await cmd.runCommand(message, ["konachan", "https://konachan.com/post/show/258662/animal_ears-anthropomorphism-ass-azur_lane-bell-bl"])
        assert(await cmd.assertLast("azur_lane"))
    })

    it("should work with a query", async function() {
        assert(await cmd.assertImage(["konachan", "gabriel", "dropout"]))
    })

    it("should only run r18 commands in NSFW channels", async function() {
        assert(await cmd.assertNSFW(["konachan", "r18"]))
    })

    it("should send an r18 image from a query", async function() {
        assert(await cmd.assertImage(["konachan", "r18", "gabriel", "dropout"]))
    })

    it("should reject an invalid query", async function() {
        await cmd.runCommand(message, ["konachan", "fakeQueryAf"])
        assert(await cmd.assertLast("No results were found."))
    })

    it("should reject an invalid url", async function() {
        await cmd.assertReject(["konachan", "https://konachan.com/post/show/342342342434"])
    })

})
