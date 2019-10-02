import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permissions} from "./../../structures/Permissions"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Prefix extends Command {
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

        const newPrefix = args[1]

        await SQLQuery.updatePrefix(message, newPrefix)

        const prefixEmbed: any = embeds.createEmbed()
        prefixEmbed
        .setDescription("The prefix has been changed to " + newPrefix + "\n" + "If you ever forget the prefix just tag me!")
        message.channel.send(prefixEmbed)
        return

    }
}
