import {Message, Role} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Selfrole extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const perms = new Permission(discord, message)
        const sql = new SQLQuery(message)
        const embeds = new Embeds(discord, message)
        if (!await perms.checkMod()) return
        let selfroles = await sql.fetchColumn("special roles", "self roles")
        selfroles = JSON.parse(selfroles[0])

        if (!selfroles[0]) return

        const roles = message.guild!.roles.filter((r: Role) => {
            for (let i = 0; i < selfroles.length; i++) {
                const found = (selfroles[i] === r.id) ? true : false
                return found
            }
            return false
        }).map((r: Role) => r)

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name.toLowerCase().includes(args[1].toLowerCase())) {
                const found = message.member!.roles.find((r: Role) => r.id === roles[i].id)
                let description = ""
                if (found) {
                    await message.member!.roles.remove(roles[i].id)
                    description = `${discord.getEmoji("star")}<@${message.author!.id}>, you no longer have the <@&${roles[i].id}> role!`
                } else {
                    await message.member!.roles.add(roles[i].id)
                    description = `${discord.getEmoji("star")}<@${message.author!.id}>, you were given the <@&${roles[i].id}> role!`
                }
                const selfEmbed = embeds.createEmbed()
                selfEmbed
                .setTitle(`**Self Role** ${discord.getEmoji("karenSugoi")}`)
                .setDescription(description)
                message.channel.send(selfEmbed)
            }
        }
    }
}
