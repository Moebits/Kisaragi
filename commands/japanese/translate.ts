import {Message} from "discord.js"
import * as langs from "../../assets/json/langs.json"
import {Command} from "../../structures/Command"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"

const translate = require("@vitalets/google-translate-api")

export default class Japanese extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Translates text to another language.",
            help:
            `
            \`translate code text\` - Translates the text into the given language (2 letter code)
            \`translate text\` - Translates the text to english
            \`japanese text\` - Special alias for japanese translation
            `,
            examples:
            `
            \`=>translate ja translate this to japanese\`
            \`=>translate これを日本語に翻訳する\`
            \`=>japanese this will be translated to japanese\`
            `,
            aliases: ["tr", "trans", "japanese", "jp"],
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message

        let translateText = Functions.combineArgs(args, 1)
        let code = "en"
        if (Object.keys(langs).includes(args[1])) {
            translateText = Functions.combineArgs(args, 2)
            code = args[1]
        } else if (args[0] === "japanese" || args[0] === "jp") {
            code = "ja"
        }

        const result = await translate(translateText, {to: code})
        await message.channel.send(`**Translated to ${langs[code]}** ${discord.getEmoji("kannaCurious")}`)
        message.channel.send(result.text)
    }
}
