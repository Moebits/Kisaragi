import {GuildEmoji, ApplicationEmoji, Message, SlashCommandBuilder, SlashCommandStringOption} from "discord.js"
import {Command} from "../../structures/Command"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class React extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: `Adds a reaction to a message.`,
            help:
            `
            \`react emoji/name/id\` - Adds a reaction from this server
            \`react dev emoji/name/id\` - Adds a reaction from the developer's servers.
            \`react global emoji/name/id\` - Finds a reaction from all servers that the bot is in.
            \`react msg/message id dev?/global? emoji/name/id\` - Adds a reaction to the specified message instead of the last one.
            `,
            examples:
            `
            \`=>react raphiOMG\`
            `,
            aliases: ["reaction"],
            cooldown: 5,
            slashEnabled: true
        })
        const fourthOption = new SlashCommandStringOption()
            .setName("emoji4")
            .setDescription("This is the emoji for the dev/global msg subcommand.")

        const thirdOption = new SlashCommandStringOption()
            .setName("emoji3")
            .setDescription("This can be an emoji or dev/global for the msg subcommand.")

        const secondOption = new SlashCommandStringOption()
            .setName("emoji2")
            .setDescription("This can be an emoji or message id for the msg subcommand.")

        const firstOption = new SlashCommandStringOption()
            .setName("emoji")
            .setDescription("This can be an emoji or dev/global/msg for additional subcommands.")
            .setRequired(true)

        this.slash = new SlashCommandBuilder()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addStringOption(firstOption)
            .addStringOption(secondOption)
            .addStringOption(thirdOption)
            .addStringOption(fourthOption)
            .toJSON()
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        if (!args[1]) return message.reply(`What reaction do you want to add ${discord.getEmoji("kannaFacepalm")}`)

        let lastMessage = await discord.getLastMessage(message)

        if (args[1] === "msg" || args[1] === "message") {
            const msg = await discord.fetchMessage(message, args[2]) as Message<true> ?? message
            if (msg) {
                lastMessage = msg
            } else {
                return message.reply(`Can't find this message ${discord.getEmoji("kannaFacepalm")}`)
            }
            args.shift()
            args.shift()
        }
        let emoji: GuildEmoji | ApplicationEmoji | null
        switch (args[1]) {
            case "dev":
                if (!args[2]) return message.reply(`What reaction do you want to add ${discord.getEmoji("kannaFacepalm")}`)
                emoji = discord.getEmoji(args[2])
                break
            case "global":
                if (!args[2]) return message.reply(`What reaction do you want to add ${discord.getEmoji("kannaFacepalm")}`)
                emoji = discord.getEmojiGlobal(args[2], true)
                break
            default:
                emoji = discord.getEmojiServer(args[1], message, true)
        }
        if (!emoji) return message.reply(`Could not find this emoji ${discord.getEmoji("kannaFacepalm")}`)

        await lastMessage.react(emoji)
        message.delete().catch(() => null)
    }
}
