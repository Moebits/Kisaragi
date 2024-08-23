import {GuildBasedChannel, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Remdash extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Removes dashes from channel names (disabled).",
            aliases: ["delhyphen"],
            guildOnly: true,
            cooldown: 5,
            unlist: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        //return message.reply("This command no longer works, it is disabled! (Discord patched unicode spaces in channel names.)")
        if (!await perms.checkMod()) return
        const remEmbed = embeds.createEmbed()
        const nameArray = message.guild!.channels.cache.map((c: GuildBasedChannel) => c.name)
        const idArray = message.guild!.channels.cache.map((c: GuildBasedChannel) => c.id)
        for (let i = 0; i < nameArray.length; i++) {
            if (nameArray[i].includes("-")) {
                const newName = nameArray[i].replace(/-/g, "\u2005")
                const channel = message.guild!.channels.cache.find((c: GuildBasedChannel) => c.id === idArray[i])
                await channel!.setName(newName)
            }
        }
        remEmbed
        .setTitle(`**Remdash** ${discord.getEmoji("KannaXD")}`)
        .setDescription("Removed dashes from all channel names!")
        message.channel.send({embeds: [remEmbed]})
        return

    }
}
