import {assert} from "chai"
import "mocha"
import login, {cmd, message} from "../login"

describe.only("deviantart", async function() {
    this.beforeAll(async function() {
        await login()
    })

    it("should work no query", async function() {
        assert(await cmd.assertImage(["deviantart"]))
    })

    it("should work for a query", async function() {
        assert(await cmd.assertImage(["deviantart", "art"]))
    })

    it("should work with a link", async function() {
        assert(await cmd.assertImage(["deviantart", "https://www.deviantart.com/fhilippe124/art/Nezuko-Kamado-Kimetsu-no-Yaiba-795592793"]))
    })

    it("should work for a user", async function() {
        await cmd.runCommand(message, ["deviantart", "user", "tenpii"])
        assert(await cmd.assertLast("Tenpii"))
    })

    it("should work for user galleries", async function() {
        assert(await cmd.assertImage(["deviantart", "gallery", "fhilippe124"]))
    })

    it("should work for daily search", async function() {
        assert(await cmd.assertImage(["deviantart", "daily", "2019-07-03"]))
    })

    it("should work for new search", async function() {
        assert(await cmd.assertImage(["deviantart", "new", "anime"]))
    })

    it("should work for hot search", async function() {
        assert(await cmd.assertImage(["deviantart", "hot", "manga"]))
    })

    it("should work for popular search", async function() {
        assert(await cmd.assertImage(["deviantart", "popular", "anime"]))
    })

    it("should reject invalid queries", async function() {
        assert(await cmd.assertReject(["deviantart", "aVeryFakeQuery12345"]))
    })

    it("should reject nsfw on non-NSFW channels", async function() {
        assert(await cmd.assertNSFW(["deviantart", "https://www.deviantart.com/prywinko/art/Echidna-NSFW-preview-814261412"]))
    })

    it("should reject invalid links", async function() {
        assert(await cmd.assertReject(["deviantart", "https://www.deviantart.com/fakeUser/art/fake-af-link-435453545"]))
    })
})
