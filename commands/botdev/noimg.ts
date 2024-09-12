import {EmbedBuilder, Message} from "discord.js"
import {SlashCommandSubcommand, SlashCommandOption} from "../../structures/SlashCommandOption"
import fs from "fs"
import path from "path"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Permission} from "../../structures/Permission"
import {SQLQuery} from "../../structures/SQLQuery"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"

export default class NoImg extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Lists all commands with no image.",
            help:
            `
            \`noimg\` - Show noimg commands
            \`unlist\` - Show unlisted commands
            `,
            examples:
            `
            \`=>noimg\`
            `,
            aliases: ["unlist", "hidden"],
            cooldown: 10,
            botdev: true,
            subcommandEnabled: true
        })
        this.subcommand = new SlashCommandSubcommand()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const sql = new SQLQuery(message)
        const perms = new Permission(discord, message)
        const embeds = new Embeds(discord, message)
        if (!perms.checkBotDev()) return
        let unlist = false
        if (args[0] === "unlist" || args[0] === "hidden") unlist = true
        const names: string[] = []
        const subDir = fs.readdirSync(path.join(__dirname, "../../commands"))
        for (let k = 0; k < subDir.length; k++) {
            const commands = fs.readdirSync(path.join(__dirname, `../../commands/${subDir[k]}`))
            for (let m = 0; m < commands.length; m++) {
                commands[m] = commands[m].slice(0, -3)
                if (commands[m] === "empty" || commands[m] === "tempCodeRunnerFile") continue
                const cmdClass = new (require(`../${subDir[k]}/${commands[m]}`).default)(this.discord, this.message)
                if (cmdClass.options.unlist === true) {
                    if (unlist) names.push(commands[m])
                    continue
                } else {
                    if (unlist) continue
                }
                const rawPath = path.join(__dirname, `../../../assets/help/${subDir[k]}/${commands[m]}`)
                if (fs.existsSync(`${rawPath}.png`)) {
                    continue
                } else if (fs.existsSync(`${rawPath}.gif`)) {
                    continue
                } else if (fs.existsSync(`${rawPath}.jpg`)) {
                    continue
                }
                names.push(commands[m])
            }
        }

        let desc = ""
        for (let i = 0; i < names.length; i++) {
            desc += `\`${names[i]}\`\n`
        }
        const splits = Functions.splitMessage(desc, {maxLength: 1800, char: "\n"})

        const embedArray: EmbedBuilder[] = []
        for (let i = 0; i < splits.length; i++) {
            const embed = embeds.createEmbed()
            embed
            .setTitle(`**${unlist ? "Unlisted" : "No Image"}** ${discord.getEmoji("sagiriBleh")}`)
            .setDescription(splits[i])
            embedArray.push(embed)
        }

        if (embedArray.length === 1) {
            this.reply(embedArray[0])
        } else {
            embeds.createReactionEmbed(embedArray)
        }
    }
}
