import Anilist from "anilist-node"
import type {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class AnilistCommand extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches for anime and manga on anilist.",
            help:
            `
            \`anilist\` - Gets the top anime
            \`mal query\` - Searches for anime matching the query
            \`anilist manga query\` - Searches for manga with the query
            `,
            examples:
            `
            \`=>anilist eromanga sensei\`
            `,
            aliases: ["animelist", "anilist"],
            random: "none",
            cooldown: 10,
            unlist: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const anilist = new Anilist(process.env.ANILIST_TOKEN)
        const term = Functions.combineArgs(args, 1)

        const search = await anilist.search("anime", term, 1, 10)
        console.log(search)

    }
}
