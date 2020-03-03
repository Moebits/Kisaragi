import axios from "axios"
import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Shorten extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Shortens an url using is.gd.",
            help:
            `
            \`shorten url\` - Shortens the url
            `,
            examples:
            `
            \`=>shorten https://www.youtube.com/\`
            `,
            aliases: [],
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const message = this.message
        const input = Functions.combineArgs(args, 1)
        const embeds = new Embeds(this.discord, message)
        if (!input) return this.noQuery(embeds.createEmbed())
        const json = await axios.get(`https://is.gd/create.php?format=json&url=${input.trim()}`)
        const newLink = json.data.shorturl
        message.channel.send(newLink)
    }
}
