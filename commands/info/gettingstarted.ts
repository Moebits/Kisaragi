import {Message, MessageReaction, TextChannel, User} from "discord.js"
import {SlashCommandSubcommand, SlashCommandOption} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import * as config from "./../../config.json"
import {CommandFunctions} from "./../../structures/CommandFunctions"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class GettingStarted extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Posts getting started info.",
            help:
            `
            \`gettingstarted channel?\` - Sends getting started info to the channel or current one
            `,
            examples:
            `
            \`=>gettingstarted\`
            `,
            aliases: [],
            random: "none",
            cooldown: 10,
            subcommandEnabled: true
        })
        const channelOption = new SlashCommandOption()
            .setType("string")
            .setName("channel")
            .setDescription("Optional channel to post in")

        this.subcommand = new SlashCommandSubcommand()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addOption(channelOption)
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const cmd = new CommandFunctions(discord, message)
        if (!message.guild) return
        let prefix = await SQLQuery.fetchPrefix(message)
        if (!prefix) prefix = "=>"
        const guildOwner = await message.guild.fetchOwner()
        const joinEmbed = embeds.createEmbed()
        joinEmbed
        .setAuthor({name: "getting started", iconURL: "https://i.kym-cdn.com/photos/images/facebook/001/415/932/f20.png"})
        .setTitle(`**Getting Started** ${discord.getEmoji("kisaragiBawls")}`)
        .setThumbnail(discord.user!.displayAvatarURL({extension: "png"}))
        .setDescription(
            `Thanks for adding me to your guild${guildOwner.user.username ? `, **${guildOwner.user.username}**` : ""}! ${discord.getEmoji("chinoSmug")}\n\n` +
            `${discord.getEmoji("star")}The current prefix is set to \`${prefix}\`. Use \`${prefix}help\` at anytime to display the list of commands.\n` +
            `${discord.getEmoji("star")}For detailed command help, use \`${prefix}help (command)\`.\n` +
            `${discord.getEmoji("star")}If you would like to change the bot prefix, use \`${prefix}prefix\`. If you forget your prefix you can tag me.\n` +
            `${discord.getEmoji("star")}Configure your server moderation settings with \`${prefix}mod\`, and general bot settings with \`${prefix}config\`.\n` +
            `${discord.getEmoji("star")}Set welcome and leave messages with \`${prefix}welcome\` and \`${prefix}leave\` respectively.\n` +
            `${discord.getEmoji("star")}Set selfroles and reactionroles with \`${prefix}selfroles\` and \`${prefix}reactionroles\` respectively.\n` +
            `${discord.getEmoji("star")}Many commands run automatically when a link is posted, such as \`${prefix}youtube\` for youtube links. If you don't want this behavior change it in \`${prefix}detect\`.\n` +
            `${discord.getEmoji("star")}Some commands such as \`${prefix}email\` and \`${prefix}tweet\` require oauth2 authentication in \`${prefix}oauth2\` and \`${prefix}twitteroauth\`.\n` +
            `${discord.getEmoji("star")}You can use \`${prefix}random\` to run a random command, or \`${prefix}chain\` to run multiple commands in succession.\n` +
            `${discord.getEmoji("star")}Send feedback and suggestions to the developer using \`${prefix}feedback\`.\n` +
            `${discord.getEmoji("star")}By adding the bot to your server, you agree to the privacy policy in \`${prefix}privacy\` and the terms of service in \`${prefix}tos\`.\n` +
            `\n` +
            `${discord.getEmoji("termsofservice")}[**Terms of Service**](https://kisaragi.moe/terms)\n` +
            `${discord.getEmoji("privacypolicy")}[**Privacy Policy**](https://kisaragi.moe/terms#privacy)\n` +
            `I hope that you enjoy using this bot! ${discord.getEmoji("aquaUp")}\n` +
            `The command documentation is also on my [**website**](${config.website}).`
        )
        let msg = null as unknown as Message
        try {
            if (args[1]) {
                const chan = message.guild?.channels.cache.find((c) => c.id === args[1].match(/\d{15,}/)?.[0]) as TextChannel
                if (chan) msg = await discord.channelSend(chan, joinEmbed)
            } else {
                msg = await this.reply(joinEmbed)
            }
        } catch {
            const m = await discord.fetchFirstMessage(message.guild!)
            if (m) msg = await discord.send(m, joinEmbed)
        }

        if (msg) await msg.react(discord.getEmoji("help"))
        const helpCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("help").id && user.bot === false
        const help = msg?.createReactionCollector({filter: helpCheck})

        help?.on("collect", async (reaction, user) => {
            await reaction.users.remove(user)
            await this.send(`<@${user.id}>, here is the help command!`)
            await cmd.runCommand(msg, ["help"])
            help.stop()
        })
    }
}
