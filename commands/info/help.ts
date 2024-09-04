import {Message, EmbedBuilder, SlashCommandBuilder, SlashCommandStringOption, ChatInputCommandInteraction} from "discord.js"
import fs from "fs"
import path from "path"
import * as config from "../../config.json"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Help extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
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
            cooldown: 20,
            slashEnabled: true
        })
        const commandOption = new SlashCommandStringOption()
            .setName("command")
            .setDescription("This can be dm, a specific command, or !category to retrieve a category.")

        this.slash = new SlashCommandBuilder()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addStringOption(commandOption)
            .toJSON()
    }

    public emojiMap: any = {
        "admin": this.discord.getEmoji("raphiOMG"),
        "anime": this.discord.getEmoji("gabYes"),
        "bot developer": this.discord.getEmoji("no"),
        "config": this.discord.getEmoji("akariLurk"),
        "fun": this.discord.getEmoji("chinoSmug"),
        "game": this.discord.getEmoji("yaoi"),
        "heart": this.discord.getEmoji("kannaPat"),
        "booru": this.discord.getEmoji("madokaLewd"),
        "info": this.discord.getEmoji("kannaCurious"),
        "weeb": this.discord.getEmoji("kannaHungry"),
        "level": this.discord.getEmoji("kannaXD"),
        "image": this.discord.getEmoji("tohruSmug"),
        "misc": this.discord.getEmoji("karenXmas"),
        "misc 2": this.discord.getEmoji("sataniaDead"),
        "mod": this.discord.getEmoji("kannaFreeze"),
        "music": this.discord.getEmoji("poiHug"),
        "music 2": this.discord.getEmoji("yes"),
        "music 3": this.discord.getEmoji("vigneDead"),
        "reddit": this.discord.getEmoji("aquaWut"),
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
        "booru": "https://i.imgur.com/NmVMub7.png",
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
        "admin": "https://cdn.discordapp.com/emojis/1280922651984138260.png",
        "anime": "https://cdn.discordapp.com/emojis/1280922668698173500.png",
        "bot developer": "https://cdn.discordapp.com/emojis/1280922779473940560.png",
        "config": "https://cdn.discordapp.com/emojis/1280922887926059091.png",
        "fun": "https://cdn.discordapp.com/emojis/1280923131237629973.gif",
        "game": "https://cdn.discordapp.com/emojis/1280923170706165771.png",
        "heart": "https://cdn.discordapp.com/emojis/1280923184522330264.png",
        "booru": "https://cdn.discordapp.com/emojis/1280922770720424038.png",
        "info": "https://cdn.discordapp.com/emojis/1280923275198992454.png",
        "weeb": "https://cdn.discordapp.com/emojis/1280923306438037535.png",
        "level": "https://cdn.discordapp.com/emojis/1280923336842678283.png",
        "image": "https://cdn.discordapp.com/emojis/1280923254608892028.png",
        "misc": "https://cdn.discordapp.com/emojis/1280923465670725754.png",
        "misc 2": "https://cdn.discordapp.com/emojis/1280923487850205346.png",
        "mod": "https://cdn.discordapp.com/emojis/1280923499988521032.png",
        "music": "https://cdn.discordapp.com/emojis/1280923530178854993.png",
        "music 2": "https://cdn.discordapp.com/emojis/1280923562043248730.png",
        "music 3": "https://cdn.discordapp.com/emojis/1280923547660849173.png",
        "reddit": "https://cdn.discordapp.com/emojis/1280923741039231057.png",
        "twitter": "https://cdn.discordapp.com/emojis/1280924124092567594.png",
        "video": "https://cdn.discordapp.com/emojis/1280924222759239842.png",
        "waifu": "https://cdn.discordapp.com/emojis/1280924243894210705.png",
        "website": "https://cdn.discordapp.com/emojis/1280924254816309279.png",
        "website 2": "https://cdn.discordapp.com/emojis/1280924275263541248.png",
        "website 3": "https://cdn.discordapp.com/emojis/1280924265994125343.png"
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        // @ts-ignore
        if (message instanceof ChatInputCommandInteraction) await message.deferReply()
        
        const subDir = fs.readdirSync(path.join(__dirname, "../../commands"))
        const helpEmbedArray: EmbedBuilder[] = []
        if (args[1] && !args[1].startsWith("!") && args[1]?.toLowerCase() !== "dm" && args[1] !== "2") {
            const helpDir = new (require(path.join(__dirname, "./helpInfo")).default)(this.discord, this.message)
            await helpDir.run(args)
            return
        }
        if (args[1]?.toLowerCase() === "dm") {
            const dmEmbeds: EmbedBuilder[] = []
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
                    .addFields([{name: `${this.emojiMap[subDir[k]]} ${Functions.toProperCase(subDir[k])} (${counter})`.trim(), value: help}])
                }
                dmEmbed
                .setAuthor({name: "help", iconURL: "https://i.imgur.com/qcSWLSf.png"})
                .setTitle(`**Help** ${discord.getEmoji("aquaUp")}`)
                .setDescription(`_Reactions cannot be removed in dm's, so remove them yourself._`)
                if (!discord.checkMuted(message)) dmEmbed.addFields([{name: `${discord.getEmoji("raphiSmile")} Additional Links`, value: `[Website](${config.website}) | [Invite](${config.invite.replace("CLIENTID", discord.user!.id)}) | [Source](${config.repo})`}])
                dmEmbeds.push(dmEmbed)
            }
            embeds.createReactionEmbed(dmEmbeds, false, false, 1, message.author)
            let rep: Message
            if (message instanceof ChatInputCommandInteraction) {
                // @ts-ignore
                rep = await message.editReply(`Sent you the commands list! Make sure you have direct messages enabled, globally and server wide. ${discord.getEmoji("karenSugoi")}`)
            } else {
                rep = await message.reply(`Sent you the commands list! Make sure you have direct messages enabled, globally and server wide. ${discord.getEmoji("karenSugoi")}`)
            }
            if (args[2] === "delete") setTimeout(() => rep.delete(), 3000)
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
            .setAuthor({name: "help", iconURL: "https://i.imgur.com/qcSWLSf.png"})
            .setImage(this.imageMap[subDir[i]])
            .setThumbnail(discord.muted ? "" : this.thumbMap[subDir[i]])
            .setDescription(
                `Type \`help (command)\` for detailed help info! ${discord.getEmoji("aquaUp")}\n` +
                `To display only one category, use \`help !(category)\` ${discord.getEmoji("gabYes")}\n` +
                `_Click on a reaction twice to toggle compact mode._\n` + help)
            if (!discord.checkMuted(message)) helpEmbed.addFields([{name: `${discord.getEmoji("raphiSmile")} Additional Links`, value: `[Website](${config.website}) | [Invite](${config.invite.replace("CLIENTID", discord.user!.id)}) | [Source](${config.repo})`}])
            helpEmbedArray.push(helpEmbed)
        }
        if (setIndex > -1) {
            if (message instanceof ChatInputCommandInteraction) {
                // @ts-ignore
                return message.editReply({embeds: [helpEmbedArray[setIndex]]})
            } else {
                return message.channel.send({embeds: [helpEmbedArray[setIndex]]})
            }
        } else {
            if (args[1] === "2") {
                embeds.createHelpEmbed(helpEmbedArray, 2)
            } else {
                embeds.createHelpEmbed(helpEmbedArray)
            }
        }
    }
}
