import {assert} from "chai"
import "mocha"
import login, {cmd, message} from "../login"

describe("anime", async function() {
    this.beforeAll(async function() {
        await login()
    })

    it("should reject on no query", async function() {
        await cmd.assertReject(["anime"])
    })

    it("should reject on invalid query", async function() {
        await cmd.assertReject(["anime", "thisIsNotAnAnime"])
    })

    it("should search for anime", async function() {
        await cmd.runCommand(message, ["anime", "gabriel dropout"])
        assert((await cmd.assertLast("Japanese Title") && (await cmd.assertLast(true) > 1000)))
    })
})
