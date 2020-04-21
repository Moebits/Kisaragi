import {GuildMember, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Ban extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Bans the specified users.",
            help:
            `
            \`ban @user1 @user2 reason?\` - Bans the user(s) with an optional reason
            \`ban id1 id2 reason?\` - Bans by user id instead of mention
            `,
            examples:
            `
            \`=>ban @user spammer\`
            `,
            guildOnly: true,
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        if (!await perms.checkMod()) return
        const banEmbed = embeds.createEmbed()
        const reasonArray: string[] = []
        const userArray: string[] = []

        for (let i = 1; i < args.length; i++) {
            if (args[i].match(/\d+/g)) {
                userArray.push(args[i].match(/\d+/g)![0])
            } else {
                reasonArray.push(args[i])
            }
        }

        const reason = reasonArray.join("") ? reasonArray.join(" ") : "None provided!"

        const members: string[] = []
        for (let i = 0; i < userArray.length; i++) {
            const user = await discord.users.fetch(userArray[i])
            if (user) {
                members.push(`<@${user.id}>`)
            } else {
                continue
            }
            banEmbed
            .setAuthor("ban", "https://discordemoji.com/assets/emoji/bancat.png")
            .setTitle(`**You Were Banned** ${discord.getEmoji("kannaFU")}`)
            .setDescription(`${discord.getEmoji("star")}_You were banned from ${message.guild!.name} for reason:_ **${reason}**`)
            const dm = await user.createDM()
            try {
                await message.guild?.members.ban(user, {reason, days: 7})
            } catch {
                return message.reply(`I need the **Ban Members** permission ${discord.getEmoji("kannaFacepalm")}`)
            }
            await dm.send(banEmbed).catch(() => null)
        }
        if (!members[0]) return message.reply(`Invalid users ${discord.getEmoji("kannaFacepalm")}`)
        banEmbed
        .setAuthor("ban", "https://discordemoji.com/assets/emoji/bancat.png")
        .setTitle(`**Member Banned** ${discord.getEmoji("kannaFU")}`)
        .setDescription(`${discord.getEmoji("star")}_Successfully banned ${members.join(", ")} for reason:_ **${reason}**`)
        message.channel.send(banEmbed)
        return
    }
}
