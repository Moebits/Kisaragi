import {Message, SlashCommandBuilder, SlashCommandStringOption} from "discord.js"
import {Command} from "../../structures/Command"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Say extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Posts your message.",
            help:
            `
            \`say text\` - Posts the text.
            `,
            examples:
            `
            \`=>say I love you\`
            `,
            aliases: [],
            cooldown: 3,
            slashEnabled: true
        })
        const textOption = new SlashCommandStringOption()
            .setName("text")
            .setDescription("The text to post.")
            .setRequired(true)

        this.slash = new SlashCommandBuilder()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addStringOption(textOption)
            .toJSON()
    }

    public run = async (args: string[]) => {
        const message = this.message

        let prefix = await SQLQuery.fetchPrefix(message)
        if (!prefix) prefix = "=>"

        const rawText = Functions.combineArgs(args, 1)
        if (!rawText) return message.reply("You did not provide any text.")

        if (message instanceof Message) {
            await message.channel.send({content: Functions.checkChar(rawText, 2000, "."), allowedMentions: {parse: []}})
            if (message.content?.startsWith(prefix)) await message.delete().catch(() => null)
        } else {
            await (message as any).reply({content: Functions.checkChar(rawText, 2000, "."), allowedMentions: {parse: []}})
        }
    }
}
