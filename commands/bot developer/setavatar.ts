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
            \`setavatar url?\` - Sets the avatar.
            `,
            examples:
            `
            \`=>setavatar\`
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

        let image: string | undefined
        if (!args[1]) {
            image = await discord.fetchLastAttachment(message)
        } else {
            image = args[1]
        }

        if (!image) return message.reply("No avatar found!")
        await discord.user!.setAvatar(image)

        return message.reply(`Avatar successfully set! ${discord.getEmoji("aquaUp")}`)
    }
}
