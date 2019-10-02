import {Message, MessageAttachment} from "discord.js"
import * as fs from "fs"
import * as svgCaptcha from "svg-captcha"
import {Embeds} from "./Embeds"
import {Kisaragi} from "./Kisaragi"

export class Captcha {
    private readonly embeds = new Embeds(this.discord, this.message)
    constructor(private readonly discord: Kisaragi, private readonly message: Message) {}

    public createCaptcha = async (type: string[], color: string[], difficulty: string[]) => {

        const svg2img = require("svg2img")

        let tSize: number
        let mMax: number
        switch (difficulty.join("")) {
            case "easy":
                tSize = 4
                mMax = 10
                break
            case "medium":
                tSize = 6
                mMax = 100
                break
            case "hard":
                tSize = 8
                mMax = 1000
                break
            case "extreme":
                tSize = 12
                mMax = 1000
            default:
                tSize = 4
                mMax = 10
        }

        const captcha = (type.join() === "text") ?
        svgCaptcha.create({
                size: tSize,
                ignoreChars: "0oli",
                noise: 1,
                color: true,
                background: color.join("")
            }) :
            svgCaptcha.createMathExpr({
                mathMin: 1,
                mathMax: mMax,
                mathOperator: "+-",
                color: true,
                background: color.join("")
            })

        await svg2img(captcha.data, function(error: Error, buffer: Buffer) {
            fs.writeFileSync("../assets/images/captcha.png", buffer)
        })

        const attachment = new MessageAttachment("../assets/images/captcha.png")

        const captchaEmbed = this.embeds.createEmbed()
        captchaEmbed
        .setTitle(`Captcha ${this.discord.getEmoji("kannaAngry")}`)
        .attachFiles([attachment.url])
        .setImage(`attachment://captcha.png`)
        .setDescription(
            `${this.discord.getEmoji("star")}_Solve the captcha below. Type **cancel** to quit, or **skip** to get another captcha._`
        )
        return {
            captcha: captchaEmbed,
            text: captcha.text
        }
    }
}
