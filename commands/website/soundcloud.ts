import {Message} from "discord.js"
import Soundcloud from "soundcloud.ts"
import {Command} from "../../structures/Command"
import {Functions} from "../../structures/Functions"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class SoundCloud extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches soundcloud.",
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message

        const soundcloud = new Soundcloud(process.env.SOUNDCLOUD_CLIENT_ID, process.env.SOUNDCLOUD_OAUTH_TOKEN)

        const query = Functions.combineArgs(args, 1)
        const tracks = await soundcloud.tracks.search({q: query})

        const embeds = new Embeds(discord, message)

        for (let i = 0; i < tracks.length; i++) {
            const soundcloudEmbed = embeds.createEmbed()
            soundcloudEmbed
            .setTitle(`**Soundcloud Search** ${discord.getEmoji("karenSugoi")}`)
        }

    }
}
