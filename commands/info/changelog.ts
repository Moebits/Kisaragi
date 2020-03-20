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
            {num: 14, date: "3/20/2020", changes: "Fixed the photoshop editor, added pagination for the booru commands and the new command \`safebooru\`."},
            {num: 13, date: "3/19/2020", changes: "Fixed some image commands such as \`sharpen\`."},
            {num: 12, date: "3/18/2020", changes: "Added the command \`crunchydl\` which can download anime episodes from crunchyroll or their subtitiles."},
            {num: 11, date: "3/18/2020", changes: "Added new video commands, for speeding up/reversing videos or for converting them to mp3/gif files."},
            {num: 10, date: "3/17/2020", changes: "I moved opencv (anime detection), chrome (website screenshots), and image uploading to a seperate api to reduce the file size on the bot and to make them easier to maintain."},
            {num: 9, date: "3/17/2020", changes: "The pixiv download command now supports folder mapping (organizing pictures into subfolders within the zip file)."},
            {num: 8, date: "3/17/2020", changes: "There are now image manipulation commands as well, such as brightness, contrast, flip, hsv, etc. I added an editor with an undo/redo system for ease of use."},
            {num: 7, date: "3/17/2020", changes: "I also added support for audio effects and filters, such as: reverse, speed, pitch, highpass, highshelf, etc."},
            {num: 6, date: "3/17/2020", changes: "There are a ton of updates so get ready. I added music playback commands with a queue system. You can play tracks from youtube, soundcloud, links, and attachments."},
            {num: 5, date: "3/8/2020", changes: "Added \`binary/hexadecimal/base64/md5/bcrypt\` commands. They are kind of pointless but whatever."},
            {num: 4, date: "3/7/2020", changes: "Added bandcamp, wattpad, pokemon, and nasa commands. Help embeds can now be collapsed, as well."},
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

        const splits = Util.splitMessage(changeDesc, {maxLength: 1800, char: "\n"})

        const changeArray: MessageEmbed[] = []
        for (let i = 0; i < splits.length; i++) {
            const changeEmbed = embeds.createEmbed()
            changeEmbed
            .setAuthor("changelog", "https://img.favpng.com/2/13/11/computer-icons-wiki-inventory-png-favpng-i4uMvTFMU19rMhp60WF2G2Jsy.jpg")
            .setTitle(`**Changelog** ${discord.getEmoji("tohruThumbsUp2")}`)
            .setDescription(splits[i])
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
