import {Message, SlashCommandBuilder, SlashCommandStringOption, ChatInputCommandInteraction} from "discord.js"
import {Command} from "../../structures/Command"
import {CommandFunctions} from "./../../structures/CommandFunctions"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Chain extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Runs multiple commands in succession.",
            help:
            `
            _Note: The limit is 5 commands (to prevent abuse). This can be used to quickly set options such as reaction roles._
            \`chain cmd1 & cmd2\` - Run multiple commands separated by "&"
            `,
            examples:
            `
            \`=>chain holiday & mention kurisumasu\`
            \`=>chain kawaii & kitsune & neko\`
            \`=>chain reactionroles [messageID] @role1 !emoji1! & reactionroles [messageID] @role2 !emoji2!\`
            `,
            aliases: [],
            cooldown: 200,
            slashEnabled: true
        })
        const chainOption = new SlashCommandStringOption()
            .setName("chain")
            .setDescription("The commands to chain separated by \"&\".")
            
        this.slash = new SlashCommandBuilder()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addStringOption(chainOption)
            .toJSON()
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const commands = new CommandFunctions(discord, message)
        const embeds = new Embeds(discord, message)
        if (!args[1]) return this.noQuery(embeds.createEmbed())

        const loading = message.channel.lastMessage
        if (message instanceof Message) loading?.delete()

        const cmdArgs = args.join(" ").split("& ")
        if (cmdArgs.length > 5 && (message.author.id !== process.env.OWNER_ID)) return message.reply(`Chaining 5+ commands is restricted to the bot developer. ${discord.getEmoji("sagiriBleh")}`)
        for (let i = 0; i < cmdArgs.length; i++) {
            if (message instanceof ChatInputCommandInteraction && i == 1) {
                // @ts-ignore
                return message.channel.send("Sorry, running more than one chain isn't supported in slash commands.")
            }
            const running = await message.channel.send(`**Running Chain ${i + 1}** ${discord.getEmoji("kisaragiCircle")}`)
            await commands.runCommand(message, cmdArgs[i].replace(/chain/g, "").split(" "))
            setTimeout(() => running.delete(), 1000)
        }
        await message.channel.send(" ").catch(() => null)
    }
}
