import {Message} from "discord.js"
import {Embeds} from "./Embeds"
import {Kisaragi} from "./Kisaragi"
import {Permission} from "./Permission"
import {SQLQuery} from "./SQLQuery"
export class Block {
    constructor(private readonly discord: Kisaragi, private readonly message: Message) {}
    public blockWord = async () => {
        const message = this.message
        const sql = new SQLQuery(message)
        if (message.author!.bot) return
        let words = await sql.fetchColumn("guilds", "blocked words")
        if (words === null || !words?.[0]) return
        words = words as unknown as string[]
        const asterisk = await sql.fetchColumn("guilds", "asterisk").then((a: string[]) => String(a) === "on" ? true : false)
        words.forEach((w: string) => w.replace(/0/gi, "o").replace(/1/gi, "l").replace(/!/gi, "l"))
        const match = await sql.fetchColumn("guilds", "block match")
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
            const promo = await sql.fetchColumn("guilds", "self promo")
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

    public containsInvite = () => {
        return /(?<=(discord.gg|discordapp.com\/invite)\/)[a-z0-9]+/gi.test(this.message.content)
    }

    public everyone = async () => {
        const msg = this.message
        const embeds = new Embeds(this.discord, msg)
        const sql = new SQLQuery(msg)
        const perms = new Permission(this.discord, msg)
        if (msg.content.includes("@everyone") || msg.content.includes("@here")) {
          if (msg.member?.hasPermission("MENTION_EVERYONE") || await perms.checkMod(true)) return
          const toggle = await sql.fetchColumn("guilds", "everyone ban toggle")
          if (toggle === "on") {
            try {
              await msg.member?.ban({reason: "Mentioning everyone", days: 7})
              const banEmbed = embeds.createEmbed()
              .setAuthor("ban", "https://discordemoji.com/assets/emoji/bancat.png")
              .setTitle(`**Member Banned** ${this.discord.getEmoji("kannaFU")}`)
              .setDescription(`${this.discord.getEmoji("star")}_Successfully banned <@${msg.author.id}> for reason:_ **Mentioning everyone without having the permission to do so.**`)
              msg.channel.send(banEmbed)
              const dmEmbed = embeds.createEmbed()
              dmEmbed
              .setAuthor("ban", "https://discordemoji.com/assets/emoji/bancat.png")
              .setTitle(`**You Were Banned** ${this.discord.getEmoji("kannaFU")}`)
              .setDescription(`${this.discord.getEmoji("star")}_You were banned from ${msg.guild!.name} for reason:_ **Mentioning everyone without having the permission to do so.**`)
              const dm = await msg.author.createDM()
              await msg.author.send(dmEmbed).catch(() => null)
            } catch {
              // Do nothing
            }
          }
        }
    }

    public gallery = async () => {
        const message = this.message
        const sql = new SQLQuery(message)
        if (message.attachments.size) return
        const gallery = await sql.fetchColumn("guilds", "gallery")
        if (!gallery) return
        if (gallery.includes(message.channel.id)) {
            try {
                await message.delete()
                const rep = await message.reply(`This is a gallery channel, you can only post images here!`)
                rep.delete({timeout: 3000})
            } catch {
                return message.channel.send(`I need the **Manage Messages** permission to delete text messages in gallery channels ${this.discord.getEmoji("kannaFacepalm")}`)
            }
        }
    }
}
