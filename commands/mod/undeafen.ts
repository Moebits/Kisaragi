import {GuildMember, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Undeafen extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Server undeafens a user.",
            help:
            `
            \`undeafen @user1 @user2 reason?\` - Server undeafens the user(s) with an optional reason
            \`undeafen id1 id2 reason?\` - Server undeafens by user id instead of mention
            `,
            examples:
            `
            \`=>undeafen @user\`
            `,
            guildOnly: true,
            aliases: ["undeaf", "vcundeaf"],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        if (!await perms.checkMod()) return
        const undeafenEmbed = embeds.createEmbed()
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
            undeafenEmbed
            .setAuthor({name: "undeafen", iconURL: "https://d29fhpw069ctt2.cloudfront.net/icon/image/39276/preview.png"})
            .setTitle(`**You Were Undeafened** ${discord.getEmoji("mexShrug")}`)
            .setDescription(`${discord.getEmoji("star")}_You were undeafened from ${message.guild!.name} for reason:_ **${reason}**`)
            const dm = await member.createDM()
            try {
                await member.voice.setDeaf(false, reason)
                const data = {type: "undeafen", user: member.id, executor: message.author.id, date: Date.now(), guild: message.guild?.id, reason, context: message.url}
                discord.emit("caseUpdate", data)
            } catch {
                return message.reply(`I need the **undeafen Members** permission, or this user is not in a voice channel ${discord.getEmoji("kannaFacepalm")}`)
            }
            await dm.send({embeds: [undeafenEmbed]}).catch(() => null)
        }
        if (!members[0]) return message.reply(`Invalid users ${discord.getEmoji("kannaFacepalm")}`)
        undeafenEmbed
        .setAuthor({name: "undeafen", iconURL: "https://d29fhpw069ctt2.cloudfront.net/icon/image/39276/preview.png"})
        .setTitle(`**Member Undeafened** ${discord.getEmoji("mexShrug")}`)
        .setDescription(`${discord.getEmoji("star")}_Successfully undeafened ${members.join(", ")} for reason:_ **${reason}**`)
        message.channel.send({embeds: [undeafenEmbed]})
        return
    }
}
