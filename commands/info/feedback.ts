import {Message, TextChannel} from "discord.js"
import fs from "fs"
import * as config from "../../config.json"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Feedback extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Sends bug reports or suggestions to the developer.",
            help:
            `
            \`feedback msg\` - Sends feedback to the developer
            `,
            examples:
            `
            \`=>feedback some feedback\`
            `,
            aliases: ["suggest", "suggestion", "bug", "report"],
            cooldown: 10,
            guildOnly: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const feedChannel = discord.channels.cache.get(config.feedback) as TextChannel
        const invite = await discord.getInvite(message.guild)
        const feedback = Functions.combineArgs(args, 1).trim()
        if (!feedback) return message.reply(`What is the feedback that you want to send ${discord.getEmoji("kannaCurious")}`)
        const feedEmbed = embeds.createEmbed()
        feedEmbed
        .setAuthor({name: "feedback", iconURL: "https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-and-lines-1/2/12-512.png"})
        .setTitle(`**Bot Feedback** ${discord.getEmoji("tohruSmug")}`)
        .setThumbnail(message.author.displayAvatarURL({extension: "png"}))
        .setDescription(
            `${discord.getEmoji("star")}_User:_ **${message.author.tag}** \`(${message.author.id})\`\n` +
            `${discord.getEmoji("star")}_Guild:_ **${message.guild?.name}** \`(${message.guild?.id})\`\n` +
            `${discord.getEmoji("star")}_Channel:_ **${(message.channel as TextChannel).name}**\n` +
            `${discord.getEmoji("star")}_Invite:_ ${invite}\n` +
            `${discord.getEmoji("star")}_Feedback:_ ${Functions.checkChar(feedback, 1700, " ")}`
        )
        feedChannel?.send({embeds: [feedEmbed]})
        return message.reply(`Your message was successfully sent! I will get back to you if I implement your suggestion ${discord.getEmoji("gabYes")}`)
    }
}
