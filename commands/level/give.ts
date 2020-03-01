import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Give extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Gives a user level xp.",
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)

        const giveEmbed = embeds.createEmbed()

        console.log(giveEmbed)
        return
    }
}
