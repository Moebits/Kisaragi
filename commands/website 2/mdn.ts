import axios from "axios"
import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class MDN extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches the mdn docs.",
            help:
            `
            \`mdn query\` - Searches mdn for the query
            `,
            examples:
            `
            \`=>mdn array\`
            `,
            aliases: ["jsref"],
            cooldown: 5
        })
    }

    public mdnReplace = (str: string) => {
        return str
        .replace(/Array/gm, "[**Array**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)")
        .replace(/Object/gm, "[**Object**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)")
        .replace(/Function/gm, "[**Function**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)")
        .replace(/Boolean/gm, "[**Boolean**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)")
        .replace(/Number/gm, "[**Number**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)")
        .replace(/String/gm, "[**String**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)")
        .replace(/Date/gm, "[**Date**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)")
        .replace(/RegExp/gm, "[**RegExp**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)")
        .replace(/Set/gm, "[**Set**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)")
        .replace(/JSON/gm, "[**JSON**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)")
        .replace(/Promise/gm, "[**Promise**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)")
        .replace(/BigInt/gm, "[**BigInt**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)")
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const query = Functions.combineArgs(args, 1)
        if (!query) {
            return this.noQuery(embeds.createEmbed()
            .setTitle(`**MDN Search** ${discord.getEmoji("gabStare")}`)
            .setAuthor(`mdn`, "https://developer.mozilla.org/static/img/opengraph-logo.72382e605ce3.png"))
        }
        const url = `https://mdn.pleb.xyz/search?local=en-US&q=${query}`
        const result = await axios.get(url).then((r) => r.data)
        let similar = ""
        for (let i = 0; i < result.Subpages.length; i++) {
            similar += `[**${result.Subpages[i].Label}**](https://developer.mozilla.org/${result.Subpages[i].URL})\n`
        }
        const mdnEmbed = embeds.createEmbed()
        mdnEmbed
        .setTitle(`**${result.Title}** ${discord.getEmoji("gabStare")}`)
        .setAuthor(`mdn`, "https://developer.mozilla.org/static/img/opengraph-logo.72382e605ce3.png")
        .setThumbnail(message.author!.displayAvatarURL({format: "png", dynamic: true}))
        .setURL(`https://developer.mozilla.org/${result.URL}`)
        .setDescription(
        `${discord.getEmoji("star")}_Modified:_ ${Functions.formatDate(result.Modified)}\n` +
        `${discord.getEmoji("star")}_Summary:_ ${Functions.cleanHTML(result.Summary)}\n` +
        `${discord.getEmoji("star")}_Tags:_ ${this.mdnReplace(result.Tags.join(", "))}\n` +
        `${discord.getEmoji("star")}_Similar:_ \n${Functions.checkChar(similar, 1000, "\n")}`
        )

        message.channel.send(mdnEmbed)
    }
}
