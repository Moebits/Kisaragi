import {assert} from "chai"
import "mocha"
import login, {cmd, message} from "../login"

describe.only("lolibooru", async function() {
    this.beforeAll(async function() {
        await login()
    })

    it("should send an image on no query.", async function() {
        assert(await cmd.assertImage(["lolibooru"]))
    })

    it("should work with a link", async function() {
        await cmd.runCommand(message, ["lolibooru", "https://lolibooru.moe/post/show/202922/1girl-o-blue_eyes-blush-bow-eromanga_sensei-eyebro"])
        assert(await cmd.assertLast("izumi_sagiri"))
    })

    it("should work with a query", async function() {
        assert(await cmd.assertImage(["lolibooru", "gabriel", "dropout"]))
    })

    it("should only run r18 commands in NSFW channels", async function() {
        assert(await cmd.assertNSFW(["lolibooru", "r18"]))
    })

    it("should send an r18 image from a query", async function() {
        assert(await cmd.assertImage(["lolibooru", "r18", "gabriel", "dropout"]))
    })

    it("should reject an invalid query", async function() {
        await cmd.assertReject(["lolibooru", "fakeQueryAf"])
    })

    it("should reject an invalid url", async function() {
        await cmd.assertReject(["lolibooru", "https://lolibooru.moe/post/show/45435455"])
    })

})
