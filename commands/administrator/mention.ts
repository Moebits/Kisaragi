import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permissions} from "./../../structures/Permissions"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Mention extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const perms = new Permissions(discord, message)
        const embeds = new Embeds(discord, message)
        if (await perms.checkAdmin(message)) return
        const mentionEmbed: any = embeds.createEmbed()
        const prefix = await SQLQuery.fetchPrefix(message)

        const input = Functions.combineArgs(args, 1)
        const role = message.guild!.roles.find((r: any) => r.name.toLowerCase().includes(input.toLowerCase().trim()))
        if (!role) {
            message.channel.send(mentionEmbed
            .setDescription("Could not find that role!"))
            return
        }
        await role.setMentionable(true)
        await message.channel.send(`<@&${role.id}>`)
        await role.setMentionable(false)
        if (message.content.startsWith(prefix[0])) await message.delete()
    }
}
