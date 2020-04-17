import {Message} from "discord.js"
import {Kisaragi} from "./Kisaragi"
import {SQLQuery} from "./SQLQuery"

export class Block {
    constructor(private readonly discord: Kisaragi, private readonly message: Message) {}
    public blockWord = async () => {
        const message = this.message
        const sql = new SQLQuery(message)
        if (message.author!.bot) return
        let words = await sql.fetchColumn("blocks", "blocked words")
        if (words === null || !words?.[0]) return
        words = words as unknown as string[]
        const asterisk = await sql.fetchColumn("blocks", "asterisk").then((a: string[]) => String(a) === "on" ? true : false)
        words.forEach((w: string) => w.replace(/0/gi, "o").replace(/1/gi, "l").replace(/!/gi, "l"))
        const match = await sql.fetchColumn("blocks", "block match")
        if (String(match) === "exact") {
            if (words.some((w: string) => w.includes(message.content) || (asterisk ? message.content.match(/\*/g) : false))) {
                if (!message.guild?.me?.permissions.has("MANAGE_MESSAGES")) return message.channel.send("I need the **Manage Messages** permission in order to delete the message with the blocked word.")
                const reply = await message.reply("Your post was removed because it contained a blocked word.")
                await message.delete()
                reply.delete({timeout: 10000})
            }
        } else {
            for (let i = 0; i < words.length; i++) {
                if (message.content.includes(words[i]) || (asterisk ? message.content.match(/\*/g) : false)) {
                    if (!message.guild?.me?.permissions.has("MANAGE_MESSAGES")) return message.channel.send("I need the **Manage Messages** permission in order to delete the message with the blocked word.")
                    const reply = await message.reply("Your post was removed because it contained a blocked word.")
                    await message.delete()
                    reply.delete({timeout: 10000})
                }
            }
        }
    }

    public blockInvite = async () => {
        const message = this.message
        const sql = new SQLQuery(message)
        const regex = /(?<=(discord.gg|discordapp.com\/invite)\/)[a-z0-9]+/gi
        const match = message.content.match(regex)
        if (match?.[0]) {
            const promo = await sql.fetchColumn("blocks", "self promo")
            if (promo) {
                const channel = this.message.guild?.channels.cache.get(promo)
                if (this.message.channel.id === channel?.id) return
            }
            let del = true
            try {
                const invites = await message.guild?.fetchInvites()
                if (invites?.has(match[0].trim())) del = false
            } finally {
                // Do nothing
            }
            if (del) {
                const reply = await message.reply("Your post was removed because it contained an invite to another server.")
                await message.delete()
                reply.delete({timeout: 10000})
            }
        }
    }
}
