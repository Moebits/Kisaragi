import {Message} from "discord.js"
import {SQLQuery} from "./SQLQuery"

export class Block {
    public static blockWord = async (message: Message) => {
        const sql = new SQLQuery(message)
        if (message.author!.bot) return
        const words = await sql.fetchColumn("blocks", "blocked words")
        if (!words) return
        const asterisk = await sql.fetchColumn("blocks", "asterisk").then((a: string[]) => String(a) === "on" ? true : false)
        if (!words[0]) return
        words.forEach((w: string) => {console.log(w); w.replace(/0/gi, "o").replace(/1/gi, "l").replace(/!/gi, "l")})
        const match = await sql.fetchColumn("blocks", "block match")
        if (String(match) === "exact") {
            if (words.some((w: string) => w.includes(message.content) || (asterisk ? message.content.match(/\*/g) : false))) {
                const reply = await message.reply("Your post was removed because it contained a blocked word.")
                await message.delete()
                reply.delete({timeout: 10000})
            }
        } else {
            for (let i = 0; i < words.length; i++) {
                if (message.content.includes(words[i]) || (asterisk ? message.content.match(/\*/g) : false)) {
                    const reply = await message.reply("Your post was removed because it contained a blocked word.")
                    await message.delete()
                    reply.delete({timeout: 10000})
                }
            }
        }
    }
}
