import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"

export default class Steam extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches the steam store (disabled).",
            help:
            `
            \`steam query\` - Searches steam.
            `,
            examples:
            `
            \`=>steam\`
            `,
            aliases: [],
            random: "none",
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        return message.reply("This command isn't finished.")

        return
    }
}
