import {Message, Role} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Mention extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Mentions any role, then sets it to unmentionable.",
            help:
            `
            \`mention @role\` - Mentions the role, and then makes it unmentionable.
            `,
            examples:
            `
            \`=>mention @news\`
            `,
            guildOnly: true,
            aliases: [],
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        const embeds = new Embeds(discord, message)
        if (!await perms.checkAdmin()) return
        const loading = message.channel.lastMessage
        loading?.delete()
        const mentionEmbed = embeds.createEmbed()
        const prefix = await SQLQuery.fetchPrefix(message)

        const input = Functions.combineArgs(args, 1)
        if (!input) return message.reply(`What role do you want me to mention ${discord.getEmoji("kannaCurious")}`)
        const role = message.guild!.roles.cache.find((r: Role) => r.name.toLowerCase().includes(input.toLowerCase().trim()))
        if (!role) {
            message.channel.send({embeds: [mentionEmbed
            .setDescription("Could not find that role!")]})
            return
        }
        try {
            await role.setMentionable(true)
            await message.channel.send({content: `<@&${role.id}>`, allowedMentions: {parse: ["roles", "users"]}})
            await role.setMentionable(false)
        } catch {
            return message.reply("Could not mention this role, I need the **Manage Roles** permission.")
        }

        if (message.content.startsWith(prefix[0])) await message.delete()
    }
}
