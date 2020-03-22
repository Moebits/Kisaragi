import {MessageEmbed, MessageReaction, User} from "discord.js"
import {Embeds} from "./../structures/Embeds"
import {Kisaragi} from "./../structures/Kisaragi"
import {SQLQuery} from "./../structures/SQLQuery"
const active = new Set()

export default class MessageReactionAdd {
    constructor(private readonly discord: Kisaragi) {}

    public run = async (reaction: MessageReaction, user: User) => {
        if (user.id === this.discord.user!.id) return
        const sql = new SQLQuery(reaction.message)
        const retriggerEmbed = async (reaction: MessageReaction) => {
            if (!reaction.message.partial) return
            const embeds = new Embeds(this.discord, reaction.message)
            reaction.message = await reaction.message.fetch()
            if (reaction.message.author.id === this.discord.user!.id) {
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
                        const help = await sql.fetchColumn("collectors", "help", "message", reaction.message.id)
                        const download = await sql.fetchColumn("collectors", "download", "message", reaction.message.id)
                        const newEmbeds: MessageEmbed[] = []
                        for (let i = 0; i < cachedEmbeds.length; i++) {
                            newEmbeds.push(new MessageEmbed(JSON.parse(cachedEmbeds[i])))
                        }
                        active.add(reaction.message.id)
                        if (!help && !download) {
                            embeds.editHelpEmbed(reaction.message, reaction.emoji.name, user, newEmbeds)
                        } else {
                            embeds.editReactionCollector(reaction.message, reaction.emoji.name, user, newEmbeds, Boolean(collapse), Boolean(download), Number(page))
                        }
                    }
                } else {
                    return
                }
            }
        }
        retriggerEmbed(reaction)
    }
}
