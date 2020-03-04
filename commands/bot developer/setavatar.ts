import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Set extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Changes the bots avatar.",
            help:
            `
            \`setavatar url?\` - Sets the avatar to the ru
            `,
            examples:
            `
            \`=>set watching anime, dnd\`
            `,
            aliases: ["setav"],
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        const embeds = new Embeds(discord, message)
        if (!perms.checkBotDev()) return

        W
    }
}
