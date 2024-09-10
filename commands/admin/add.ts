import {GuildMember, Message} from "discord.js"
import {SlashCommandSubcommand, SlashCommandOption} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Detector} from "./../../structures/Detector"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Add extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Adds members to this guild. **Requires oauth2**",
            help:
            `
            _Note: See the \`oauth2\` command._
            \`add id/tag\` - Adds the user if possible.
            `,
            examples:
            `
            \`=>add User#6666\`
            `,
            guildOnly: true,
            aliases: [],
            cooldown: 10,
            subcommandEnabled: true
        })
        const addOption = new SlashCommandOption()
            .setType("string")
            .setName("add")
            .setDescription("Can be an id/tag.")
            
        this.subcommand = new SlashCommandSubcommand()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addOption(addOption)
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        if (!await perms.checkAdmin()) return
        const embeds = new Embeds(discord, message)
        const sql = new SQLQuery(message)
        const argArray = args.slice(1)
        const tokenArray: string[] = []
        const idArray: string[] = []
        for (let i = 0; i < argArray.length; i++) {
            let token: string | undefined
            if (/\d{10,}/.test(argArray[i])) {
                token = await sql.fetchColumn("oauth2", "access token", "user id", argArray[i])
                if (token) idArray.push(argArray[i])
            } else {
                token = await sql.fetchColumn("oauth2", "access token", "user tag", argArray[i])
                if (token) {
                    const id = await sql.fetchColumn("oauth2", "user id", "access token", token)
                    idArray.push(id)
                }
            }
            if (!token) return message.reply(`These users must give me additional oauth2 permissions. See the **oauth2** command.`)
            tokenArray.push(token)
        }

        for (let i = 0; i < tokenArray.length; i++) {
            try {
                await message.guild?.members.add(idArray[i], {accessToken: tokenArray[i]})
            } catch {
                continue
            }
            const user = await discord.users.fetch(idArray[i])
            const dm = embeds.createEmbed()
            dm
            .setAuthor({name: "guild add", iconURL: "https://cdn.discordapp.com/emojis/588199024906207271.gif"})
            .setTitle(`**Guild Addition** ${discord.getEmoji("tohruSmug")}`)
            .setDescription(
                `${discord.getEmoji("star")}You were added to the guild **${message.guild?.name}** by **${message.author.tag}**. If you want to prevent admins from adding you to guilds, use \`oauth2 delete\`.`
            )
            await user.send({embeds: [dm]}).catch(() => null)
        }

        const addEmbed = embeds.createEmbed()
        addEmbed
        .setAuthor({name: "guild add", iconURL: "https://cdn.discordapp.com/emojis/588199024906207271.gif"})
        .setTitle(`**Guild Member Add** ${discord.getEmoji("tohruSmug")}`)
        .setDescription(
            `${discord.getEmoji("star")}Added ${idArray.map((id) => `<@!${id}>`).join(", ")} to this guild!`
        )
        return message.channel.send({embeds: [addEmbed]})
    }
}
