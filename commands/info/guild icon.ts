import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class GuildIcon extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)

        const guildIconEmbed: any = embeds.createEmbed()

        await message.channel.send(guildIconEmbed
            .setDescription(`**${message.guild!.name}'s Guild Icon**`)
            .setImage(`${message.guild!.iconURL}` + "?size=2048"))
    }
}
