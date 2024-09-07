import {Message, Role} from "discord.js"
import {SlashCommandOption} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Selfrole extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Adds a role from the self assignable roles list.",
            help:
            `
            _Note:_ Add roles to the self assignable role list with **selfroles**.
            \`selfrole rolename\` - Adds a role from the guilds self assignable role list
            `,
            examples:
            `
            \`=>selfrole kanna\`
            `,
            guildOnly: true,
            aliases: ["sr"],
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        const sql = new SQLQuery(message)
        const embeds = new Embeds(discord, message)
        if (!await perms.checkMod()) return
        let selfroles = await sql.fetchColumn("guilds", "self roles")

        if (!selfroles) return message.reply(`You have not set any selfroles, do so in the \`selfroles\` command ${discord.getEmoji("raphi")}`)
        if (!args[1]) return message.reply(`What role are you asking for ${discord.getEmoji("kannaCurious")}`)

        const roles = message.guild!.roles.cache.filter((r: Role) => {
            for (let i = 0; i < selfroles.length; i++) {
                const found = (selfroles[i] === r.id) ? true : false
                return found
            }
            return false
        }).map((r: Role) => r)

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name.toLowerCase().includes(args[1].toLowerCase())) {
                const found = message.member!.roles.cache.find((r: Role) => r.id === roles[i].id)
                let description = ""
                if (found) {
                    try {
                        await message.member!.roles.remove(roles[i].id)
                        description = `${discord.getEmoji("star")}<@${message.author!.id}>, you no longer have the <@&${roles[i].id}> role!`
                    } catch {
                        description = "I need the **Manage Roles** permission in order to remove this role."
                    }
                } else {
                    try {
                        await message.member!.roles.add(roles[i].id)
                        description = `${discord.getEmoji("star")}<@${message.author!.id}>, you were given the <@&${roles[i].id}> role!`
                    } catch {
                        description = "I need the **Manage Roles** permission in order to add this role."
                    }
                }
                const selfEmbed = embeds.createEmbed()
                selfEmbed
                .setTitle(`**Self Role** ${discord.getEmoji("karenSugoi")}`)
                .setDescription(description)
                message.channel.send({embeds: [selfEmbed]})
            }
        }
    }
}
