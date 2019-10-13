import {assert} from "chai"
import "mocha"
import login, {cmd} from "../login"

describe("kitsune", async function() {
    this.beforeAll(async function() {
        await login()
    })

    it("should work with no params", async function() {
        assert(await cmd.assertImage(["kitsune"]))
    })

    it("should work for ecchi images", async function() {
        assert(await cmd.assertImage(["kitsune", "ecchi"]))
    })

    it("should work for lewd images", async function() {
        assert(await cmd.assertImage(["kitsune", "lewd"]))
    })
})
