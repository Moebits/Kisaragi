import {Message, AttachmentBuilder, ChatInputCommandInteraction} from "discord.js"
import fs from "fs"
import path from "path"
import {Command} from "../../structures/Command"
import {Kisaragi} from "../../structures/Kisaragi"
import {CommandFunctions} from "./../../structures/CommandFunctions"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"

export default class HelpInfo extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Detailed help info.",
            aliases: [],
            cooldown: 3,
            unlist: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const cmdFunctions = new CommandFunctions(discord, message)
        const embeds = new Embeds(discord, message)
        const command = discord.commands.get(args[1])
        if (!command) return cmdFunctions.noCommand(args[1])
        const category = command.category
        const name = command.name
        const aliases = command.options.aliases.join("") ? `**${command.options.aliases.join(", ")}**` : "_None_"
        let image = ""
        if (fs.existsSync(path.join(__dirname, `../../../assets/help/${category}/${name}.png`))) {
            image = path.join(__dirname, `../../../assets/help/${category}/${name}.png`)
        } else if (fs.existsSync(path.join(__dirname, `../../../assets/help/${category}/${name}.gif`))) {
            image = path.join(__dirname, `../../../assets/help/${category}/${name}.gif`)
        } else if (fs.existsSync(path.join(__dirname, `../../../assets/help/${category}/${name}.jpg`))) {
            image = path.join(__dirname, `../../../assets/help/${category}/${name}.jpg`)
        }
        const helpInfoEmbed = embeds.createEmbed()
        let attachments = [] as AttachmentBuilder[]
        if (image) {
            const img = new AttachmentBuilder(image)
            attachments.push(img)
            helpInfoEmbed
            .setImage(`attachment://${path.basename(img.attachment as string)}`)
        }
        helpInfoEmbed
        .setTitle(`**Command Help** ${discord.getEmoji("gabYes")}`)
        .setAuthor({name: "help", iconURL: "https://i.imgur.com/qcSWLSf.png"})
        .setThumbnail(message.author!.displayAvatarURL({extension: "png"}))
        .setDescription(Functions.multiTrim(`
            ${discord.getEmoji("star")}_Name:_ **${name}**
            ${discord.getEmoji("star")}_Category:_ **${category}**
            ${discord.getEmoji("star")}_Description:_ ${command.options.description}
            ${discord.getEmoji("star")}_Aliases:_ ${aliases}
            ${discord.getEmoji("star")}_Cooldown:_ **${command.options.cooldown}**
            ${discord.getEmoji("star")}_Help:_ \n${Functions.multiTrim(command.options.help)}
            ${discord.getEmoji("star")}_Examples:_ \n${Functions.multiTrim(command.options.examples)}
        `))
        if (this.message instanceof ChatInputCommandInteraction) {
            // @ts-ignore
            await this.message.editReply({embeds: [helpInfoEmbed], files: attachments})
        } else {
            await this.message.channel.send({embeds: [helpInfoEmbed], files: attachments})
        }
    }
}
