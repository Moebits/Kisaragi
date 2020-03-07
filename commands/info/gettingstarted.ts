import {Message, MessageEmbed, TextChannel} from "discord.js"
import {Command} from "../../structures/Command"
import * as config from "./../../config.json"
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
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const prefix = message ? await SQLQuery.fetchPrefix(message) : "=>"
        const joinEmbed = embeds.createEmbed()
        joinEmbed
        .setAuthor("getting started", "https://avatar.dmzj.com/f7/fc/f7fc47bd0a36ddc2d9f4184a85b1824b.png")
        .setTitle(`**Getting Started** ${discord.getEmoji("akariYay")}`)
        .setThumbnail("https://www.pngfind.com/pngs/m/609-6093943_anime-surprised-background-hifumi-new-game-hd-png.png")
        .setDescription(
            `Thanks for adding me to your guild${message.guild?.owner?.user.username ? `, **${message.guild.owner.user.username}**` : ""}! ${discord.getEmoji("tohruThumbsUp2")}\n\n` +
            `${discord.getEmoji("star")}The current prefix is set to \`${prefix}\`. Use \`${prefix}help\` at anytime to display the list of commands.\n` +
            `${discord.getEmoji("star")}For detailed command help, use \`${prefix}help (command)\`.\n` +
            `${discord.getEmoji("star")}If you would like to change the bot prefix, use \`${prefix}prefix\`. If you forget your prefix you can always tag me.\n` +
            `${discord.getEmoji("star")}Configure your server moderation settings with \`${prefix}mod\`, and general bot settings with \`${prefix}config\`.\n` +
            `${discord.getEmoji("star")}Set welcome and leave messages with \`${prefix}welcome\` and \`${prefix}leave\`, respectively.\n` +
            `${discord.getEmoji("star")}Set selfroles and reactionroles with \`${prefix}selfroles\` and \`${prefix}reactionroles\`, respectively.\n` +
            `${discord.getEmoji("star")}A lot of commands run automatically when a link is posted, such as \`youtube\` for youtube links. If you don't want this behavior, change it in \`${prefix}detect\`.\n` +
            `${discord.getEmoji("star")}You can use \`${prefix}info\` to show my info, \`${prefix}changelog\` to show new changes, and \`${prefix}invite\` to show the invite links.\n` +
            `${discord.getEmoji("star")}Send some feedback and suggestions to the developer using \`${prefix}feedback\`, they are always welcome!\n` +
            `${discord.getEmoji("star")}Are you bored? Try using \`${prefix}random\` to run a random command. \`${prefix}minesweeper\` is also fun!\n` +
            `\n` +
            `I hope that you enjoy using the bot! ${discord.getEmoji("aquaUp")}\n` +
            `If you need additional help, you can always join my [**support server**](${config.support})`
        )
        try {
            if (args[1]) {
                const chan = message.guild?.channels.cache.find((c) => c.id === args[1].match(/\d{15,}/)?.[0]) as TextChannel
                if (chan) await chan.send(joinEmbed)
            } else {
                await message.channel.send(joinEmbed)
            }
        } catch {
            const m = await discord.fetchFirstMessage(message.guild!)
            if (m) await m?.channel.send(joinEmbed)
        }
        return
    }
}
