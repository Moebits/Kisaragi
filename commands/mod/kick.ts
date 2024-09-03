import {GuildMember, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Kick extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Kicks the specified users.",
            help:
            `
            \`kick @user1 @user2 reason?\` - Kicks the user(s) with an optional reason
            \`kick id1 id2 reason?\` - Kicks by user id instead of mention
            `,
            examples:
            `
            \`=>kick @user annoying\`
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
        const kickEmbed = embeds.createEmbed()
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
            kickEmbed
            .setAuthor({name: "kick", iconURL: "https://discordemoji.com/assets/emoji/4331_UmaruWave.png"})
            .setTitle(`**You Were Kicked** ${discord.getEmoji("kannaFU")}`)
            .setDescription(`${discord.getEmoji("star")}_You were kicked from ${message.guild!.name} for reason:_ **${reason}**`)
            const dm = await member.createDM()
            try {
                await member.kick(reason)
                const data = {type: "kick", user: member.id, executor: message.author.id, date: Date.now(), guild: message.guild?.id, reason, context: message.url}
                discord.emit("caseUpdate", data)
            } catch {
                return message.reply(`I need the **Kick Members** permission ${discord.getEmoji("kannaFacepalm")}`)
            }
            await dm.send({embeds: [kickEmbed]}).catch(() => null)
        }
        if (!members[0]) return message.reply(`Invalid users ${discord.getEmoji("kannaFacepalm")}`)
        kickEmbed
        .setAuthor({name: "kick", iconURL: "https://discordemoji.com/assets/emoji/4331_UmaruWave.png"})
        .setTitle(`**Member Kicked** ${discord.getEmoji("kannaFU")}`)
        .setDescription(`${discord.getEmoji("star")}_Successfully kicked ${members.join(", ")} for reason:_ **${reason}**`)
        message.channel.send({embeds: [kickEmbed]})
        return
    }
}
