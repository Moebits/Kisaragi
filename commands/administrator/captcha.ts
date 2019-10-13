import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Captcha} from "./../../structures/Captcha"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class CaptchaCmd extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Configure settings for captcha verification.",
            help:
            `
            Note: You can type multiple options in one command.
            \`captcha\` - Opens interactive captcha prompt.
            \`captcha enable/disable\` - Enables or disables captcha verification.
            \`captcha @role/role id\` - Sets the verify role.
            \`captcha text/math\` - Changes the captcha type.
            \`captcha easy/medium/hard/extreme\` - Changes the difficulty.
            \`captcha #hexcolor\` - Changes the background color.
            \`captcha reset\` - Resets all settings.
            `,
            examples:
            `
            \`=>captcha @Member 🔑 text medium #ffffff\`
            \`=>captcha\` _then_ \`extreme\`
            \`=>captcha math easy\`
            `,
            image: "../assets/help images/administrator/captcha.png",
            guildOnly: true,
            aliases: ["verification"],
            cooldown: 30
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        const embeds = new Embeds(discord, message)
        const sql = new SQLQuery(message)
        const captchaClass = new Captcha(discord, message)
        const star = discord.getEmoji("star")
        if (!await perms.checkAdmin()) return
        const input = Functions.combineArgs(args, 1)
        if (input.trim()) {
            message.content = input.trim()
            captchaPrompt(message)
            return
        }
        const vToggle = await sql.fetchColumn("captcha", "verify toggle")
        const vRole = await sql.fetchColumn("captcha", "verify role")
        const cType = await sql.fetchColumn("captcha", "captcha type")
        const color = await sql.fetchColumn("captcha", "captcha color")
        const difficulty = await sql.fetchColumn("captcha", "difficulty")
        const captchaEmbed = embeds.createEmbed()
        const {captcha} = await captchaClass.createCaptcha(String(cType), String(color), String(difficulty))
        captchaEmbed
        .setTitle(`**Captcha Verification** ${discord.getEmoji("kannaAngry")}`)
        .attachFiles(captcha.files)
        .setImage(captcha.image!.url)
        .setThumbnail(message.guild!.iconURL({format: "png", dynamic: true})!)
        .setDescription(
            "Configure settings for captcha verification. In order for this to function, you should create a role for verified members " +
            "and deny the @everyone role reading Permission in all your guild channels, with the exception of the rules channel and the verify channel. Use **verify** to send a captcha.\n" +
            "\n" +
            "**Verify Role** = The role given to members who solve the captcha.\n" +
            "**Captcha Type** = Either text or math.\n" +
            "**Captcha Difficulty** = Either easy, medium, hard, or extreme.\n" +
            "\n" +
            "__Current Settings:__\n" +
            `${star}_Verify Role:_ **${vRole ? "<@&" + String(vRole) + ">" : "None"}**\n` +
            `${star}_Verify Toggle:_ **${String(vToggle)}**\n` +
            `${star}_Captcha Type:_ **${String(cType)}**\n` +
            `${star}_Captcha Difficulty:_ **${String(difficulty)}**\n` +
            `${star}_Background Color:_ **${String(color)}**\n` +
            "\n" +
            "__Edit Settings:__\n" +
            `${star}_Type **enable** or **disable** to enable or disable verification._\n` +
            `${star}_**Mention a role** or type the **role id** to set the verified role._\n` +
            `${star}_Type **text** or **math** to set the captcha type._\n` +
            `${star}_Type **easy**, **medium**, **hard**, or **extreme** to set the difficulty._\n` +
            `${star}_Type a **hex color** to set the background color._\n` +
            `${star}_**You can type multiple options** to enable all at once._\n` +
            `${star}_Type **reset** to reset all settings._\n` +
            `${star}_Type **cancel** to exit._\n`
        )
        message.channel.send(captchaEmbed)

        async function captchaPrompt(msg: Message) {
            const responseEmbed = embeds.createEmbed()
            responseEmbed.setTitle(`**Captcha Verification** ${discord.getEmoji("kannaAngry")}`)
            let [setOn, setOff, setRole, setText, setMath, setColor, setEasy, setMedium, setHard, setExtreme] = [] as boolean[]
            if (msg.content.toLowerCase() === "cancel") {
                responseEmbed
                .setDescription(`${star}Canceled the prompt!`)
                msg.channel.send(responseEmbed)
                return
            }
            if (msg.content.toLowerCase() === "reset") {
                await sql.updateColumn("captcha", "verify toggle", "off")
                await sql.updateColumn("captcha", "verify role", null)
                await sql.updateColumn("captcha", "captcha type", "text")
                await sql.updateColumn("captcha", "captcha color", "#ffffff")
                await sql.updateColumn("captcha", "difficulty", "medium")
                responseEmbed
                .setDescription(`${star}All settings were reset!`)
                msg.channel.send(responseEmbed)
                return
            }

            const newRole = msg.content.match(/\d+/g)
            const newColor = msg.content.match(/(\s|^)#[0-9a-f]{3,6}/ig)

            if (msg.content.match(/enable/gi)) setOn = true
            if (msg.content.match(/disable/gi)) setOff = true
            if (msg.content.match(/text/gi)) setText = true
            if (msg.content.match(/math/gi)) setMath = true
            if (msg.content.match(/easy/gi)) setEasy = true
            if (msg.content.match(/medium/gi)) setMedium = true
            if (msg.content.match(/hard/gi)) setHard = true
            if (msg.content.match(/extreme/gi)) setExtreme = true
            if (newRole) setRole = true
            if (newColor) setColor = true

            if (setOn && setOff) {
                responseEmbed
                    .setDescription(`${star}You cannot disable/enable at the same time.`)
                msg.channel.send(responseEmbed)
                return
            }

            if (setText && setMath) {
                responseEmbed
                    .setDescription(`${star}You cannot set both captcha types at the same time.`)
                msg.channel.send(responseEmbed)
                return
            }

            if (setOn && !setRole) {
                responseEmbed
                    .setDescription(`${star}In order to enable verification, you must set the verify role.`)
                msg.channel.send(responseEmbed)
                return
            }

            let description = ""

            if (setExtreme || setHard || setMedium || setEasy) {
                const diff = setExtreme ? "extreme" : (
                    setHard ? "hard" : (
                    setMedium ? "medium" : "easy"))
                await sql.updateColumn("captcha", "difficulty", diff)
                description += `${star}Captcha difficulty set to **${diff}**!\n`
            }

            if (setOn) {
                await sql.updateColumn("captcha", "verify toggle", "on")
                description += `${star}Captcha verification is **on**!\n`
            }
            if (setOff) {
                await sql.updateColumn("captcha", "verify toggle", "off")
                description += `${star}Captcha verification is **off**!\n`
            }
            if (setText) {
                await sql.updateColumn("captcha", "captcha type", "text")
                description += `${star}Captcha type set to **text**!\n`
            }
            if (setMath) {
                await sql.updateColumn("captcha", "captcha type", "math")
                description += `${star}Captcha type set to **math**!\n`
            }
            if (setRole) {
                await sql.updateColumn("captcha", "verify role", String(newRole!))
                description += `${star}Verify role set to <@&${String(newRole!)}>!\n`
            }
            if (setColor) {
                await sql.updateColumn("captcha", "captcha color", String(newColor!))
                description += `${star}Background color set to ${String(newColor!)}\n`
            }

            if (!description) description = `${star}Invalid arguments provided, canceled the prompt.`
            responseEmbed
            .setDescription(description)
            msg.channel.send(responseEmbed)
            return
        }

        embeds.createPrompt(captchaPrompt)
    }
}
