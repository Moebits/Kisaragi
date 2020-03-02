import {Message, MessageEmbed, TextChannel} from "discord.js"
import fs from "fs"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Help extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Send feedback or suggestions to the developer.",
            help:
            `
            \`feedback msg\` - Sends feedback to the developer
            `,
            examples:
            `
            \`=>feedback some feedback\`
            `,
            aliases: ["suggest", "suggestion"],
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const star = discord.getEmoji("star")
        const feedChannel = discord.channels.cache.get("683756932317577232") as TextChannel
        let [channelName, guildName] = ["", ""]
        if (message.guild) {
            channelName = (message.channel as TextChannel).name
            guildName = message.guild.name
        } else {
            channelName = "DM"
            guildName = "DM"
        }
        const invite = await discord.getInvite(message.guild)
        const feedback = Functions.combineArgs(args, 1).trim()
        if (!feedback) return message.reply(`What is the feedback that you want to send ${discord.getEmoji("kannaCurious")}`)
        const feedEmbed = embeds.createEmbed()
        feedEmbed
        .setAuthor("feedback", "https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-and-lines-1/2/12-512.png")
        .setTitle(`**Bot Feedback** ${discord.getEmoji("tohruSmug")}`)
        .setThumbnail(message.author.displayAvatarURL({format: "png", dynamic: true}))
        .setDescription(
            `${star}_User:_ **${message.author.tag}**\n` +
            `${star}_Guild:_ **${guildName}**\n` +
            `${star}_Channel:_ **${channelName}**\n` +
            `${star}_Invite:_ ${invite}\n` +
            `${star}_Feedback:_ ${Functions.checkChar(feedback, 1700, " ")}`
        )
        feedChannel?.send(feedEmbed)
        message.reply(`Your feedback was successfully sent! I will get back to if I implement your suggestion ${discord.getEmoji("gabYes")}`)
        return
    }
}
