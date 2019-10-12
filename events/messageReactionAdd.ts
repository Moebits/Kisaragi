import {MessageEmbed, MessageReaction} from "discord.js"
import {Embeds} from "./../structures/Embeds"
import {Kisaragi} from "./../structures/Kisaragi"
import {SQLQuery} from "./../structures/SQLQuery"
const active = new Set()

export default class MessageReactionAdd {
    constructor(private readonly discord: Kisaragi) {}

    public run = async (reaction: MessageReaction) => {
        const sql = new SQLQuery(reaction.message)
        const embeds = new Embeds(this.discord, reaction.message)
        if (reaction.message.author!.id === this.discord.user!.id) {
            if (active.has(reaction.message.id)) return
            const newArray = await sql.selectColumn("collectors", "message", true)
            let cached = false
            for (let i = 0; i < newArray.length; i++) {
                if (newArray[i][0] === reaction.message.id.toString()) {
                    cached = true
                }
            }
            if (cached) {
                const messageID = await sql.fetchColumn("collectors", "message", "message", reaction.message.id)
                if (String(messageID)) {
                    const cachedEmbeds = await sql.fetchColumn("collectors", "embeds", "message", reaction.message.id)
                    const collapse = await sql.fetchColumn("collectors", "collapse", "message", reaction.message.id)
                    const page = await sql.fetchColumn("collectors", "page", "message", reaction.message.id)
                    const newEmbeds: MessageEmbed[] = []
                    for (let i = 0; i < cachedEmbeds.length; i++) {
                        newEmbeds.push(new MessageEmbed(JSON.parse(cachedEmbeds[i])))
                    }
                    active.add(reaction.message.id)
                    embeds.editReactionCollector(reaction.message, reaction.emoji.name, newEmbeds, Boolean(collapse), Number(page))
                }
            } else {
                return
            }
        }
    }
}
