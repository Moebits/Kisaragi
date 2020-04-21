import {GuildMember, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Softban extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Bans and immediately unbans the specified users.",
            help:
            `
            \`softban @user1 @user2 reason?\` - softbans the user(s) with an optional reason
            \`softban id1 id2 reason?\` - softbans by user id instead of mention
            `,
            examples:
            `
            \`=>softban @user spammer\`
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
        const softBanEmbed = embeds.createEmbed()
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
            const member = message.guild!.members.cache.find((m: GuildMember) => m.id === userArray[i])
            if (member) {
                members.push(`<@${member.id}>`)
            } else {
                continue
            }
            softBanEmbed
            .setAuthor("softban", "https://cdn.discordapp.com/emojis/593867503055274006.png")
            .setTitle(`**You Were Soft Banned** ${discord.getEmoji("sagiriBleh")}`)
            .setDescription(`${discord.getEmoji("star")}_You were soft banned from ${message.guild!.name} for reason:_ **${reason}**`)
            const dm = await member.createDM()
            const id = member.id
            try {
                await message.guild?.members.ban(member, {reason, days: 7})
                await message.guild?.members.unban(id, reason)
            } catch {
                return message.reply(`I need the **Ban Members** permission ${discord.getEmoji("kannaFacepalm")}`)
            }
            await dm.send(softBanEmbed).catch(() => null)
        }
        if (!members[0]) return message.reply(`Invalid users ${discord.getEmoji("kannaFacepalm")}`)
        softBanEmbed
        .setAuthor("softban", "https://cdn.discordapp.com/emojis/593867503055274006.png")
        .setTitle(`**Member Soft Banned** ${discord.getEmoji("sagiriBleh")}`)
        .setDescription(`${discord.getEmoji("star")}_Successfully soft banned ${members.join(", ")} for reason:_ **${reason}**`)
        message.channel.send(softBanEmbed)
        return
    }
}
