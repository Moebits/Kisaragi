import {Message, MessageEmbed} from "discord.js"
import fs from "fs"
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
            \`help cmd\` - Gets detailed help on a command
            `,
            examples:
            `
            \`=>help\`
            \`=>help help\`
            `,
            aliases: ["h"],
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const helpEmbedArray: MessageEmbed[] = []
        if (args[1]) {
            const helpDir = new (require("./helpInfo").default)(this.discord, this.message)
            await helpDir.run(args)
            return
        }
        // const unlistedDirs = ["bot developer", "heart", "logging", "music"]
        const subDir = fs.readdirSync("./commands")
        for (let i = 0; i < subDir.length; i++) {
            // if (unlistedDirs.includes(subDir[i])) continue
            let help = ""
            const commands = fs.readdirSync(`./commands/${subDir[i]}`)
            for (let j = 0; j < commands.length; j++) {
                commands[j] = commands[j].slice(0, -3)
                if (commands[j] === "empty" || commands[j] === "tempCodeRunnerFile") continue
                const cmdClass = new (require(`../${subDir[i]}/${commands[j]}`).default)(this.discord, this.message)
                if (cmdClass.options.unlist === true) continue
                help += `${discord.getEmoji("star")}\`${commands[j]}\`` + ` -> _${cmdClass.options.description}_\n`
            }
            const emojiMap: any = {
                "admin": discord.getEmoji("chikaYay"),
                "anime": discord.getEmoji("gabYes"),
                "bot developer": discord.getEmoji("no"),
                "config": discord.getEmoji("akariLurk"),
                "fun": discord.getEmoji("chinoSmug"),
                "game": discord.getEmoji("yaoi"),
                "heart": discord.getEmoji("kannaPatting"),
                "lewd": discord.getEmoji("madokaLewd"),
                "info": discord.getEmoji("kannaCurious"),
                "japanese": discord.getEmoji("kannaHungry"),
                "level": discord.getEmoji("KannaXD"),
                "logging": discord.getEmoji("tohruSmug"),
                "misc": discord.getEmoji("karenXmas"),
                "mod": discord.getEmoji("kannaFreeze"),
                "music": discord.getEmoji("PoiHug"),
                "website": discord.getEmoji("tohruThumbsUp2"),
                "website 2": discord.getEmoji("mexShrug")
            }
            const imageMap: any = {
                "admin": "https://i.imgur.com/mMXKOPW.png",
                "anime": "https://i.imgur.com/uqasXLs.png",
                "bot developer": "https://i.imgur.com/wfEfC4w.png",
                "config": "https://i.imgur.com/WoRVPR0.png",
                "fun": "https://i.imgur.com/Qt2aZ4E.png",
                "game": "https://i.imgur.com/0BmKykD.png",
                "heart": "https://i.imgur.com/uKNjZcb.png",
                "lewd": "https://i.imgur.com/alKtET3.png",
                "info": "https://i.imgur.com/BR5OtIE.png",
                "japanese": "https://i.imgur.com/7DpFyuL.png",
                "level": "https://i.imgur.com/HvIgETT.png",
                "logging": "https://i.imgur.com/2zGUmJN.png",
                "misc": "https://i.imgur.com/Rd9U6tc.png",
                "mod": "https://i.imgur.com/x3Y108l.png",
                "music": "https://i.imgur.com/eZ2IphP.png",
                "website": "https://i.imgur.com/ftVh8jx.png",
                "website 2": "https://i.imgur.com/0bUmQ7F.png"
            }
            const helpEmbed = embeds.createEmbed()
            helpEmbed
            .setTitle(`**${Functions.toProperCase(subDir[i])} Commands** ${emojiMap[subDir[i]]}`)
            .setAuthor("help", "https://cdn.discordapp.com/emojis/579856442551697418.gif")
            .setImage(imageMap[subDir[i]])
            .setThumbnail(message.author!.displayAvatarURL({format: "png", dynamic: true}))
            .setDescription(
                `Type \`help (command)\` for detailed help info! ${discord.getEmoji("aquaUp")}\n` + help)
            helpEmbedArray.push(helpEmbed)
        }
        embeds.createHelpEmbed(helpEmbedArray)
    }
}
