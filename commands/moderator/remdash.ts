import {GuildChannel, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permissions} from "./../../structures/Permissions"

export default class Remdash extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const perms = new Permissions(discord, message)
        if (await perms.checkMod(message)) return
        const remEmbed = embeds.createEmbed()
        const nameArray = message.guild!.channels.map((c: GuildChannel) => c.name)
        const idArray = message.guild!.channels.map((c: GuildChannel) => c.id)
        for (let i = 0; i < nameArray.length; i++) {
            if (nameArray[i].includes("-")) {
                const newName = nameArray[i].replace(/-/g, " ")
                const channel = message.guild!.channels.find((c: GuildChannel) => c.id === idArray[i])
                await channel!.setName(newName)
            }
        }
        remEmbed
        .setDescription("Removed dashes from all channel names!")
        message.channel.send(remEmbed)
        return

    }
}
