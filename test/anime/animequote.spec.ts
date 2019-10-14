import {assert} from "chai"
import "mocha"
import login, {cmd, message} from "../login"

describe("animequote", async function() {
    this.beforeAll(async function() {
        await login()
    })

    it("should get a random quote", async function() {
        await cmd.runCommand(message, ["animequote"])
        assert(!await cmd.assertLast("No results were found."))
    })

    it("should work for an id", async function() {
        await cmd.runCommand(message, ["animequote", "2424"])
        assert (await cmd.assertLast("Hikari"))
    })

    it("should work for an anime", async function() {
        await cmd.runCommand(message, ["animequote", "himouto"])
        assert (await cmd.assertLast("Himouto! Umaru-chan"))
    })

    it("should work for a character", async function() {
        await cmd.runCommand(message, ["animequote", "rem"])
        assert (await cmd.assertLast("Rem (re:zero)"))
    })

    it("should reject an invalid query", async function() {
        await cmd.assertReject(["animequote", "thisIsNotAnAnime"])
    })
})
