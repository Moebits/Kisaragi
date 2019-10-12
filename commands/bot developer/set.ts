import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Set extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const perms = new Permission(discord, message)
        const embeds = new Embeds(discord, message)

        if (!perms.checkBotDev()) return
        type activityTypes = number | "WATCHING" | "PLAYING" | "STREAMING" | "LISTENING"
        const activityType = args[1].toUpperCase() as activityTypes
        const activityName = Functions.combineArgs(args, 2)

        const activityTypes: string[] = ["PLAYING", "WATCHING", "LISTENING", "STREAMING"]
        const setEmbed = embeds.createEmbed()

        if (!activityName || (!activityTypes.includes(activityType.toString()))) {
            message.channel.send(setEmbed
            .setDescription("Correct usage is =>set (type) (activity), where (type) is playing, watching, listening, or streaming."))
        }

        if (activityType === "STREAMING") {
            discord.user!.setActivity(activityName, {url: "https://www.twitch.tv/tenpimusic", type: activityType})
            message.channel.send(setEmbed
            .setDescription(`I am now ${activityType} ${activityName}`))
            return
        }

        discord.user!.setActivity(activityName, {type: activityType})
        message.channel.send(setEmbed
        .setDescription(`I am now ${activityType} ${activityName}`))

    }
}
