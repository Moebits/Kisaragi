import {Message, MessageEmbed} from "discord.js"
import fs from "fs"
import path from "path"
import * as config from "../../config.json"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Help extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Lists all bot commands and describes how to use them.",
            help:
            `
            Looking for help on the help command, how ironic!
            \`help\` - Lists all commands
            \`help command\` - Gets detailed help on a command
            \`help !category\` - Only post the specific category
            \`help dm\` - Sends a compact list through dm's
            `,
            examples:
            `
            \`=>help\`
            \`=>help help\`
            \`=>help !website 2\`
            `,
            aliases: ["h"],
            cooldown: 20
        })
    }

    public emojiMap: any = {
        "admin": this.discord.getEmoji("raphiOMG"),
        "anime": this.discord.getEmoji("gabYes"),
        "bot developer": this.discord.getEmoji("no"),
        "config": this.discord.getEmoji("akariLurk"),
        "fun": this.discord.getEmoji("chinoSmug"),
        "game": this.discord.getEmoji("yaoi"),
        "heart": this.discord.getEmoji("kannaPatting"),
        "lewd": this.discord.getEmoji("madokaLewd"),
        "info": this.discord.getEmoji("kannaCurious"),
        "weeb": this.discord.getEmoji("kannaHungry"),
        "level": this.discord.getEmoji("KannaXD"),
        "image": this.discord.getEmoji("tohruSmug"),
        "misc": this.discord.getEmoji("karenXmas"),
        "misc 2": this.discord.getEmoji("sataniaDead"),
        "mod": this.discord.getEmoji("kannaFreeze"),
        "music": this.discord.getEmoji("PoiHug"),
        "music 2": this.discord.getEmoji("yes"),
        "music 3": this.discord.getEmoji("vigneDead"),
        "reddit": this.discord.getEmoji("AquaWut"),
        "twitter": this.discord.getEmoji("gabSip"),
        "video": this.discord.getEmoji("vigneXD"),
        "waifu": this.discord.getEmoji("karenSugoi"),
        "website": this.discord.getEmoji("tohruThumbsUp2"),
        "website 2": this.discord.getEmoji("mexShrug"),
        "website 3": this.discord.getEmoji("think")
    }
    public imageMap: any = {
        "admin": "https://i.imgur.com/mMXKOPW.png",
        "anime": "https://i.imgur.com/JvuBhSL.png",
        "bot developer": "https://i.imgur.com/pc9syrB.png",
        "config": "https://i.imgur.com/wWolBwY.png",
        "fun": "https://i.imgur.com/lTRD9J0.png",
        "game": "https://i.imgur.com/WCbOnxm.png",
        "heart": "https://i.imgur.com/UC8XPVE.png",
        "lewd": "https://i.imgur.com/alKtET3.png",
        "info": "https://i.imgur.com/BR5OtIE.png",
        "weeb": "https://i.imgur.com/7DpFyuL.png",
        "level": "https://i.imgur.com/fxLI1df.png",
        "image": "https://i.imgur.com/eR3k5Ur.png",
        "misc": "https://i.imgur.com/Rd9U6tc.png",
        "misc 2": "https://i.imgur.com/0ol5ajZ.png",
        "mod": "https://i.imgur.com/x3Y108l.png",
        "music": "https://i.imgur.com/eZ2IphP.png",
        "music 2": "https://i.imgur.com/fADrzzB.png",
        "music 3": "https://i.imgur.com/nKRy0NA.png",
        "reddit": "https://i.imgur.com/RxYtvDD.png",
        "twitter": "https://i.imgur.com/u19rOTB.png",
        "video": "https://i.imgur.com/qqUFolE.png",
        "waifu": "https://i.imgur.com/t5P05XQ.png",
        "website": "https://i.imgur.com/ftVh8jx.png",
        "website 2": "https://i.imgur.com/0bUmQ7F.png",
        "website 3": "https://i.imgur.com/CMm9fZy.png"
    }

    public thumbMap: any = {
        "admin": "https://cdn.discordapp.com/emojis/705317767007567923.gif",
        "anime": "https://cdn.discordapp.com/emojis/705317073479532616.gif",
        "bot developer": "https://cdn.discordapp.com/emojis/705318281761914911.gif",
        "config": "https://cdn.discordapp.com/emojis/705317790143479818.gif",
        "fun": "https://cdn.discordapp.com/emojis/705328715483316245.gif",
        "game": "https://cdn.discordapp.com/emojis/705318256474456064.gif",
        "heart": "https://cdn.discordapp.com/emojis/705318232009211954.gif",
        "lewd": "https://cdn.discordapp.com/emojis/705318022193086514.gif",
        "info": "https://cdn.discordapp.com/emojis/705318209045135423.gif",
        "weeb": "https://cdn.discordapp.com/emojis/705318087620165654.gif",
        "level": "https://cdn.discordapp.com/emojis/705318055395459134.gif",
        "image": "https://cdn.discordapp.com/emojis/705316317997039822.gif",
        "misc": "https://cdn.discordapp.com/emojis/705317919256739932.gif",
        "misc 2": "https://cdn.discordapp.com/emojis/705315393505591307.gif",
        "mod": "https://cdn.discordapp.com/emojis/705317892371120200.gif",
        "music": "https://cdn.discordapp.com/emojis/705317102478950470.gif",
        "music 2": "https://cdn.discordapp.com/emojis/705316441745784873.gif",
        "music 3": "https://cdn.discordapp.com/emojis/705329464032100393.gif",
        "reddit": "https://cdn.discordapp.com/emojis/709173418016112681.gif",
        "twitter": "https://cdn.discordapp.com/emojis/709176292293083217.gif",
        "video": "https://cdn.discordapp.com/emojis/705315341915390043.gif",
        "waifu": "https://cdn.discordapp.com/emojis/705315862667853865.gif",
        "website": "https://cdn.discordapp.com/emojis/705317129238478909.gif",
        "website 2": "https://cdn.discordapp.com/emojis/705317817771098132.gif",
        "website 3": "https://cdn.discordapp.com/emojis/705315365810339921.gif"
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const subDir = fs.readdirSync(path.join(__dirname, "../../commands"))
        const helpEmbedArray: MessageEmbed[] = []
        if (args[1] && !args[1].startsWith("!") && args[1]?.toLowerCase() !== "dm") {
            const helpDir = new (require(path.join(__dirname, "./helpInfo")).default)(this.discord, this.message)
            await helpDir.run(args)
            return
        }
        if (args[1]?.toLowerCase() === "dm") {
            const dmEmbeds: MessageEmbed[] = []
            const step = 10.0
            const increment = Math.ceil(subDir.length / step)
            for (let i = 0; i < increment; i++) {
                const dmEmbed = embeds.createEmbed()
                for (let j = 0; j < step; j++) {
                    let help = ""
                    const k = (i*step)+j
                    if (!subDir[k]) break
                    let counter = 0
                    const commands = fs.readdirSync(path.join(__dirname, `../../commands/${subDir[k]}`))
                    for (let m = 0; m < commands.length; m++) {
                        commands[m] = commands[m].slice(0, -3)
                        if (commands[m] === "empty" || commands[m] === "tempCodeRunnerFile") continue
                        const cmdClass = new (require(`../${subDir[k]}/${commands[m]}`).default)(this.discord, this.message)
                        if (cmdClass.options.unlist === true) continue
                        if (discord.checkMuted(message)) if (cmdClass.options.nsfw === true) continue
                        help += `\`${commands[m]}\` `
                        counter++
                    }
                    if (subDir[k] === "japanese") subDir[k] = "weeb"
                    dmEmbed
                    .addField(`${this.emojiMap[subDir[k]]} ${Functions.toProperCase(subDir[k])} (${counter})`.trim(), help)
                }
                dmEmbed
                .setAuthor("help", discord.muted ? "" : "https://cdn.discordapp.com/emojis/705492897579139172.gif")
                .setTitle(`**Help** ${discord.getEmoji("aquaUp")}`)
                .setDescription(`_Note: Reactions cannot be removed in dm's, so you have to remove them yourself. Running commands in dm's is supported, so you can use \`help (command)\` for detailed help here. Always use \`help dm\` for the dm-compatible command list, the bot can't scroll pages on the regular one._`)
                .addField("Additional Links", `[**Invite**](${config.invite}) | [**Server**](${config.support}) | [**Github**](${config.repo}) | [**Review**](${config.review})`)
                dmEmbeds.push(dmEmbed)
            }
            embeds.createReactionEmbed(dmEmbeds, false, false, 1, message.author)
            const rep = await message.reply(`Sent you the commands list! Make sure you have direct messages enabled, globally and server wide. ${discord.getEmoji("karenSugoi")}`)
            if (args[2] === "delete") rep?.delete({timeout: 3000})
            return
        }
        // const unlistedDirs = ["bot developer", "heart", "logging", "music"]
        let setIndex = -1
        for (let i = 0; i < subDir.length; i++) {
            // if (unlistedDirs.includes(subDir[i])) continue
            let help = ""
            const commands = fs.readdirSync(path.join(__dirname, `../../commands/${subDir[i]}`))
            for (let j = 0; j < commands.length; j++) {
                commands[j] = commands[j].slice(0, -3)
                if (commands[j] === "empty" || commands[j] === "tempCodeRunnerFile") continue
                const cmdClass = new (require(`../${subDir[i]}/${commands[j]}`).default)(this.discord, this.message)
                if (cmdClass.options.unlist === true) continue
                if (discord.checkMuted(message)) if (cmdClass.options.nsfw === true) continue
                help += `${discord.getEmoji("star")}\`${commands[j]}\`` + ` -> _${cmdClass.options.description}_\n`
            }
            if (subDir[i] === "japanese") subDir[i] = "weeb"
            if (args[1]?.startsWith("!")) {
                let input = Functions.combineArgs(args, 1).replace("!", "").trim().toLowerCase()
                if (input === "japanese") input = "weeb"
                setIndex = subDir.indexOf(input)
            }
            const helpEmbed = embeds.createEmbed()
            helpEmbed
            .setTitle(`**${Functions.toProperCase(subDir[i])} Commands** ${this.emojiMap[subDir[i]]}`)
            .setAuthor("help", discord.muted ? "" : "https://cdn.discordapp.com/emojis/705492897579139172.gif")
            .setImage(this.imageMap[subDir[i]])
            .setThumbnail(discord.muted ? "" : this.thumbMap[subDir[i]])
            .setDescription(
                `Type \`help (command)\` for detailed help info! ${discord.getEmoji("aquaUp")}\n` +
                `To display only one category, use \`help !(category)\` ${discord.getEmoji("gabYes")}\n` +
                `_Click on a reaction twice to toggle compact mode._\n` + help)
            helpEmbedArray.push(helpEmbed)
        }
        if (setIndex > -1) {
            return message.channel.send(helpEmbedArray[setIndex])
        } else {
            embeds.createHelpEmbed(helpEmbedArray)
        }
    }
}
