import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class SetName extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Changes the bot's username.",
            help:
            `
            \`setname name\` - Sets the username.
            `,
            examples:
            `
            \`=>setname kisaragi\`
            `,
            aliases: ["setusername"],
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        const embeds = new Embeds(discord, message)
        if (!perms.checkBotDev()) return

        const username = Functions.combineArgs(args, 1).trim()

        if (!username) return message.reply("No username specified!")
        await discord.user!.setUsername(username)

        return message.reply(`Username changed! ${discord.getEmoji("aquaUp")}`)
    }
}
