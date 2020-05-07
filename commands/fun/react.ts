import {GuildEmoji, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Pickle extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: `Adds a reaction to the last message.`,
            help:
            `
            \`react emoji/name/id\` - Adds a reaction from this server
            \`react dev emoji/name/id\` - Adds a reaction from the developer's servers.
            \`react global emoji/name/id\` - Finds a reaction from all servers that the bot is in.
            `,
            examples:
            `
            \`=>react raphiOMG\`
            `,
            aliases: ["reaction"],
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        if (!args[1]) return message.reply(`What reaction do you want to add ${discord.getEmoji("kannaFacepalm")}`)

        const lastMessage = await discord.getLastMessage(message)
        let emoji: GuildEmoji | string | null
        switch (args[1]) {
            case "dev":
                if (!args[2]) return message.reply(`What reaction do you want to add ${discord.getEmoji("kannaFacepalm")}`)
                emoji = discord.getEmoji(args[2])
                break
            case "global":
                if (!args[2]) return message.reply(`What reaction do you want to add ${discord.getEmoji("kannaFacepalm")}`)
                emoji = discord.getEmojiGlobal(args[2])
                break
            default:
                emoji = discord.getEmojiServer(args[1], message)
        }
        if (!emoji) return message.reply(`Could not find this emoji ${discord.getEmoji("kannaFacepalm")}`)

        await lastMessage.react(emoji)
        message.delete().catch(() => null)
    }
}
