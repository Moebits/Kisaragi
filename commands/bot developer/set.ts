import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Set extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Sets the bots presence.",
            help:
            `
            \`set type activity, status\`
            `,
            examples:
            `
            \`=>set watching anime, dnd\`
            `,
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        const embeds = new Embeds(discord, message)

        if (!perms.checkBotDev()) return
        type activityTypes = number | "WATCHING" | "PLAYING" | "STREAMING" | "LISTENING"
        type status = "online" | "dnd" | "idle" | "invisible"
        const activityType = (args[1].toUpperCase() || "PLAYING") as activityTypes
        const name = Functions.combineArgs(args, 2).split(",")[0] || "=>help"
        const status = (Functions.combineArgs(args, 2).split(",")[1] || "dnd") as status

        const activityTypes = ["PLAYING", "WATCHING", "LISTENING", "STREAMING"]
        const setEmbed = embeds.createEmbed()
        .setTitle(`**Set Presence ${discord.getEmoji("karenSugoi")}**`)

        if (activityType === "STREAMING") {
            await discord.user!.setPresence({activity: {name, url: "https://www.twitch.tv/tenpimusic", type: activityType}, status})
            message.channel.send(setEmbed
            .setDescription(`I am now **${status}** and **${args[1]} ${name}**!`))
            return
        }

        await discord.user!.setPresence({activity: {name, type: activityType}, status})
        message.channel.send(setEmbed
        .setDescription(`I am now **${status}** and **${args[1]} ${name}**!`))
    }
}
