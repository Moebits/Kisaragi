import {Message, MessageEmbed, TextChannel, Util} from "discord.js"
import {Command} from "../../structures/Command"
import * as config from "./../../config.json"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Changelog extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "The most recent bot updates in chronological order.",
            help:
            `
            \`changelog num?\` - Sends the changelog (or specific one)
            `,
            examples:
            `
            \`=>changelog\`
            `,
            aliases: ["updates"],
            random: "none",
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)

        // {num: 1, date: "", changes: ""},
        const changelog = [
            {num: 3, date: "3/6/2020", changes: "Added a download option for reaction embeds. There are also download commands for \`pixiv\`, \`soundcloud\`, and \`youtube\`, as well as a new command \`download\`."},
            {num: 2, date: "3/6/2020", changes: "The \`kancolle\` and \`azurlane\` commands can now be used without providing any arguments (added handpicked ship girls) :)"},
            {num: 1, date: "3/6/2020", changes: "This is the initial release. Added the new game command \`minesweeper\` that can be played with reactions or spoilers. Obviously, \`changelog\` as well for posting updates."}
        ]

        if (Number(args[1])) {
            const log = changelog.find((c) => c.num === Number(args[1]))
            if (!log) {
                return this.invalidQuery(embeds.createEmbed()
                .setAuthor("changelog", "https://img.favpng.com/2/13/11/computer-icons-wiki-inventory-png-favpng-i4uMvTFMU19rMhp60WF2G2Jsy.jpg")
                .setTitle(`**Changelog** ${discord.getEmoji("tohruThumbsUp2")}`))
            }
            const changeEmbed = embeds.createEmbed()
            changeEmbed
            .setAuthor("changelog", "https://img.favpng.com/2/13/11/computer-icons-wiki-inventory-png-favpng-i4uMvTFMU19rMhp60WF2G2Jsy.jpg")
            .setTitle(`**Changelog #${log.num}** ${discord.getEmoji("tohruThumbsUp2")}`)
            .setDescription(`${discord.getEmoji("star")}**${log.num}** \`(${log.date})\` -> ${log.changes}\n`)
            return message.channel.send(changeEmbed)
        }

        let changeDesc = ""
        for (let i = 0; i < changelog.length; i++) {
            changeDesc += `${discord.getEmoji("star")}**${changelog[i].num}** \`(${changelog[i].date})\` -> ${changelog[i].changes}\n`
        }

        const splits = Util.splitMessage(changeDesc, {maxLength: 2000, char: "\n"})

        const changeArray: MessageEmbed[] = []
        for (let i = 0; i < splits.length; i++) {
            const changeEmbed = embeds.createEmbed()
            changeEmbed
            .setAuthor("changelog", "https://img.favpng.com/2/13/11/computer-icons-wiki-inventory-png-favpng-i4uMvTFMU19rMhp60WF2G2Jsy.jpg")
            .setTitle(`**Changelog** ${discord.getEmoji("tohruThumbsUp2")}`)
            .setDescription(changeDesc)
            changeArray.push(changeEmbed)
        }

        if (changeArray.length === 1) {
            message.channel.send(changeArray[0])
        } else {
            embeds.createReactionEmbed(changeArray)
        }
        return
    }
}
