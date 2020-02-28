import {Message, TextChannel} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Create extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Create channels, roles, and emojis.",
            aliases: [],
            cooldown: 30
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const channel = message.channel as TextChannel
        const perms = new Permission(discord, message)
        const embeds = new Embeds(discord, message)
        const star = discord.getEmoji("star")
        star
        embeds
        if (!await perms.checkAdmin()) return

        if (!args[1] || args[1] === "channel") {
            let position = (channel.position === 0) ? channel.position - 1 : 0
            const parent = channel.parent ? channel.parent : undefined
            const newArgs = Functions.combineArgs(args, 2).split(",")
            const name = newArgs[0].replace(/ /g, "\u2005")
            const above = newArgs[1].toLowerCase()
            if (above) {
                position = message.guild!.channels.cache.find((c) => c.name.toLowerCase().includes(above))!.position - 1
            }
            if (!name) return message.reply("You did not provide a name!")
            await message.guild!.channels.create(name, {position, parent, type: "text"})
            return message.reply(`The channel ${name} was created!`)
        }

        if (args[1] === "role") {
            //
        }
    }
}
