import {assert} from "chai"
import "mocha"
import login, {cmd, message} from "../login"

describe("manga", async function() {
    this.beforeAll(async function() {
        await login()
    })

    it("should reject on no query", async function() {
        await cmd.assertReject(["manga"])
    })

    it("should reject on invalid query", async function() {
        await cmd.assertReject(["manga", "thisIsNotAManga"])
    })

    it("should search for manga", async function() {
        await cmd.runCommand(message, ["manga", "eromanga sensei"])
        assert((await cmd.assertLast("Japanese Title") && (await cmd.assertLast(true) > 1000)))
    })
})
