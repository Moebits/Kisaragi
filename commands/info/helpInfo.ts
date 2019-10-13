import {Message, MessageAttachment} from "discord.js"
import path from "path"
import {Command} from "../../structures/Command"
import {Kisaragi} from "../../structures/Kisaragi"
import {CommandFunctions} from "./../../structures/CommandFunctions"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"

export default class HelpInfo extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Detailed help info.",
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const star = discord.getEmoji("star")
        const cmdFunctions = new CommandFunctions(discord, message)
        const embeds = new Embeds(discord, message)
        let cmdPath = await cmdFunctions.findCommand(args[1])
        if (!cmdPath) return cmdFunctions.noCommand(args[1])
        cmdPath = cmdPath.replace(/..\/commands\//, "../").slice(0, -3)
        const command = new (require(cmdPath).default)(discord, message).options
        const category = path.dirname(cmdPath).replace(/\.\.\//, "")
        const name = path.basename(cmdPath)
        const aliases = command.aliases.join("") ? `**${command.aliases.join(", ")}**` : "_None_"
        const helpInfoEmbed = embeds.createEmbed()
        if (command.image) {
            const image = new MessageAttachment(command.image).attachment as string
            helpInfoEmbed
            .attachFiles([image])
            .setImage(`attachment://${path.basename(image)}`)
        }
        helpInfoEmbed
        .setTitle(`**Command Help** ${discord.getEmoji("gabYes")}`)
        .setAuthor("help", "https://cdn.discordapp.com/emojis/579856442551697418.gif")
        .setThumbnail(message.author!.displayAvatarURL({format: "png", dynamic: true}))
        .setDescription(Functions.multiTrim(`
            ${star}_Name:_ **${name}**
            ${star}_Category:_ **${category}**
            ${star}_Description:_ ${command.description}
            ${star}_Aliases:_ ${aliases}
            ${star}_Cooldown:_ **${command.cooldown}**
            ${star}_Help:_ \n${Functions.multiTrim(command.help)}
            ${star}_Examples:_ \n${Functions.multiTrim(command.examples)}
        `))
        message.channel.send(helpInfoEmbed)
    }
}
