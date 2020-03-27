import {GuildMember, Message, User} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Unban extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Unbans the specified users.",
            help:
            `
            \`unban id1 id2 reason?\` - Unbans the user(s) by user id, with an optional reason
            `,
            examples:
            `
            \`=>unban 593838271650332672 forgiven\`
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
                userArray.push(args[i].match(/\d+/g)!.toString()![0])
            } else {
                reasonArray.push(args[i])
            }
        }

        const reason = reasonArray.join("") ? reasonArray.join(" ") : "None provided!"

        const users: string[] = []
        for (let i = 0; i < userArray.length; i++) {
            const user = await discord.users.fetch(userArray[i])
            .catch(() => {
                return message.reply(`Invalid user id ${discord.getEmoji("kannaFacepalm")}`)
            }) as User
            users.push(`<@${user.id}>`)
            banEmbed
            .setTitle(`**You Were Unbanned** ${discord.getEmoji("ceaseBullying")}`)
            .setDescription(`${discord.getEmoji("star")}_You were unbanned from ${message.guild!.name} for reason:_ **${reason}**`)
            try {
                await user.send(banEmbed)
            } catch (err) {
                console.log(err)
            }
            await message.guild!.members.unban(user, reason)
        }
        banEmbed
        .setAuthor("unban", "https://discordemoji.com/assets/emoji/bancat.png")
        .setTitle(`**Member Unbanned** ${discord.getEmoji("ceaseBullying")}`)
        .setDescription(`${discord.getEmoji("star")}_Successfully unbanned ${users.join(", ")} for reason:_ **${reason}**`)
        message.channel.send(banEmbed)
        return
    }
}
