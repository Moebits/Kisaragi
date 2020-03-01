import {GuildChannel, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Remdash extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Remove dashes from channel names.",
            aliases: ["delhyphen"],
            guildOnly: true,
            cooldown: 5,
            // doesn't work anymore
            unlist: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        if (!await perms.checkMod()) return
        const remEmbed = embeds.createEmbed()
        const nameArray = message.guild!.channels.cache.map((c: GuildChannel) => c.name)
        const idArray = message.guild!.channels.cache.map((c: GuildChannel) => c.id)
        for (let i = 0; i < nameArray.length; i++) {
            if (nameArray[i].includes("-")) {
                const newName = nameArray[i].replace(/-/g, "\u2005")
                const channel = message.guild!.channels.cache.find((c: GuildChannel) => c.id === idArray[i])
                await channel!.setName(newName)
            }
        }
        remEmbed
        .setTitle(`**Remdash** ${discord.getEmoji("KannaXD")}`)
        .setDescription("Removed dashes from all channel names!")
        message.channel.send(remEmbed)
        return

    }
}
