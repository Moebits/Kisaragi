import {MessageReaction, User} from "discord.js"
import {Embeds} from "./../structures/Embeds"
import {Kisaragi} from "./../structures/Kisaragi"
import {SQLQuery} from "./../structures/SQLQuery"

export default class MessageReactionRemove {
    constructor(private readonly discord: Kisaragi) {}

    public run = (reaction: MessageReaction, user: User) => {
        const removeReactionRole = async (reaction: MessageReaction, user: User) => {
            if (user.id === this.discord.user!.id) return
            if (reaction.partial) reaction = await reaction.fetch()
            const sql = new SQLQuery(reaction.message)
            const embeds = new Embeds(this.discord, reaction.message)
            const reactionroles = await sql.fetchColumn("special roles", "reaction roles")
            if (!reactionroles?.[0]) return
            for (let i = 0; i < reactionroles.length; i++) {
                const reactionrole = JSON.parse(reactionroles[i])
                if (!reactionrole.state || reactionrole.state === "off") continue
                if (reactionrole.message !== reaction.message.id) continue
                let test = false
                if (reactionrole.emoji === reaction.emoji.id) test = true
                if (reactionrole.emoji === reaction.emoji.toString()) test = true
                if (test) {
                    const member = reaction.message.guild?.members.cache.get(user.id)
                    const exists = member?.roles.cache.get(reactionrole.role)
                    if (!exists) return
                    try {
                        const roleName = reaction.message.guild?.roles.cache.get(reactionrole.role)?.name
                        await reaction.message.member?.roles.remove(reactionrole.role)
                        if (reactionrole.dm === "on") {
                            const dmEmbed = embeds.createEmbed()
                            dmEmbed
                            .setAuthor("reaction role", "https://cdn.discordapp.com/emojis/585938418572328981.gif")
                            .setTitle(`**Reaction Role Remove** ${this.discord.getEmoji("gabuTank")}`)
                            .setDescription(`${this.discord.getEmoji("star")}Removed the role **${roleName}** in the guild **${reaction.message.guild?.name}**`)
                            await user.send(dmEmbed).catch(() => null)
                        }
                    } catch {
                        const foundMsg = await this.discord.fetchMessage(reaction.message, reactionrole.message)
                        try {
                            await foundMsg?.channel.send(`I need the **Manage Roles** permission in order to remove this reaction role ${this.discord.getEmoji("kannaFacepalm")}`)
                        } catch {
                            await user.send(`I need the **Manage Roles** permission in order to remove this reaction role ${this.discord.getEmoji("kannaFacepalm")}`)
                            .catch(() => null)
                        }
                    }
                }
            }
        }
        removeReactionRole(reaction, user)
    }
}
