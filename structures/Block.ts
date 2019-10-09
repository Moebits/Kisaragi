import {Message} from "discord.js"
import {SQLQuery} from "./SQLQuery"

export class Block {
    public static blockWord = async (message: Message) => {
        const sql = new SQLQuery(message)
        if (message.author.bot) return
        const words = await sql.fetchColumn("blocks", "blocked words")
        if (words === null) return
        const asterisk = await sql.fetchColumn("blocks", "asterisk").then((a: string[]) => a[0] === "on" ? true : false)
        if (!words) return
        words.forEach((w: string) => w.replace(/0/gi, "o").replace(/1/gi, "l").replace(/!/gi, "l"))
        const match = await sql.fetchColumn("blocks", "block match")
        if (match[0] === "exact") {
            if (words.some((w: string) => w.includes(message.content) || (asterisk ? w.match(/\*/g) : false))) {
                const reply = await message.reply("Your post was removed because it contained a blocked word.")
                await message.delete()
                reply.delete({timeout: 10000})
            }
        } else {
            for (let i = 0; i < words.length; i++) {
                if (message.content.includes(words[i]) || (asterisk ? words[i].match(/\*/g) : false)) {
                    const reply = await message.reply("Your post was removed because it contained a blocked word.")
                    await message.delete()
                    reply.delete({timeout: 10000})
                }
            }
        }
    }
}
