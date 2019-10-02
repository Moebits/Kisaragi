import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Captcha} from "./../../structures/Captcha"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Verify extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const captchaClass = new Captcha(discord, message)
        const sql = new SQLQuery(message)
        const vToggle = await sql.fetchColumn("captcha", "verify toggle")
        if (vToggle.join("") === "off") return
        const vRole = await sql.fetchColumn("captcha", "verify role")
        const cType = await sql.fetchColumn("captcha", "captcha type")
        const color = await sql.fetchColumn("captcha", "captcha color")
        const difficulty = await sql.fetchColumn("captcha", "difficulty")

        const role = message.guild!.roles.find((r: any) => r.id === vRole.join(""))
        if (!role) {
            const vErrorEmbed = embeds.createEmbed()
            vErrorEmbed.setDescription("Could not find the verify role!")
            return vErrorEmbed
        }
        const type = cType

        const {captcha, text} = await captchaClass.createCaptcha(type, color, difficulty)

        const filter = (response) => {
            return (response.author === message.author)
        }

        function sendCaptcha(cap, txt) {
            message.channel.send(cap).then(() => {
                message.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ["time"]})
                    .then(async (collected) => {
                        const msg = collected.first() as Message
                        const responseEmbed = embeds.createEmbed()
                        responseEmbed
                        .setTitle(`Captcha ${discord.getEmoji("kannaAngry")}`)
                        if (msg.content.trim() === "cancel") {
                            responseEmbed
                            .setDescription("Quit the captcha prompts.")
                            return msg.channel.send(responseEmbed)
                        } else if (msg.content.trim() === "skip") {
                            message.reply("Skipped this captcha!")
                            const result = await captchaClass.createCaptcha(type, color, difficulty)
                            return sendCaptcha(result.captcha, result.text)
                        } else if (msg.content.trim() === txt) {
                            if (msg.member!.roles.has(role!.id)) {
                                await msg.member!.roles.remove(role!)
                                await msg.member!.roles.add!(role!, "Successfully solved the captcha")
                            } else {
                                await msg.member!.roles.add(role!, "Successfully solved the captcha")
                            }
                            responseEmbed
                            .setDescription(`${discord.getEmoji("pinkCheck")} **${msg.member!.displayName}** was verified!`)
                            return msg.channel.send(responseEmbed)
                        } else {
                            msg.reply("Wrong answer! Please try again.")
                            const result = await captchaClass.createCaptcha(type, color, difficulty)
                            return sendCaptcha(result.captcha, result.text)
                        }
                    })
                    .catch((collected) => {
                        console.log(collected)
                        message.channel.send("Quit the captcha because the time has run out.")
                    })
            })

        }

        sendCaptcha(captcha, text)
    }
}
