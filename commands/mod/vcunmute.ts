import {GuildMember, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class VCUnmute extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Voice unmutes a user.",
            help:
            `
            \`vcunmute @user1 @user2 reason?\` - Voice unmutes the user(s) with an optional reason
            \`vcunmute id1 id2 reason?\` - Voice unmutes by user id instead of mention
            `,
            examples:
            `
            \`=>vcunmute @user earrape\`
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
        const vcunmuteEmbed = embeds.createEmbed()
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
            vcunmuteEmbed
            .setAuthor({name: "voice unmute", iconURL: "https://images.assetsdelivery.com/compings_v2/vectorgalaxy/vectorgalaxy1808/vectorgalaxy180807510.jpg"})
            .setTitle(`**You Were Voice Unmuted** ${discord.getEmoji("aquaUp")}`)
            .setDescription(`${discord.getEmoji("star")}_You were voice unmuted from ${message.guild!.name} for reason:_ **${reason}**`)
            const dm = await member.createDM()
            try {
                await member.voice.setMute(false, reason)
                const data = {type: "vcunmute", user: member.id, executor: message.author.id, date: Date.now(), guild: message.guild?.id, reason, context: message.url}
                discord.emit("caseUpdate", data)
            } catch {
                return message.reply(`I need the **Mute Members** permission, or this user is not in a voice channel ${discord.getEmoji("kannaFacepalm")}`)
            }
            await dm.send({embeds: [vcunmuteEmbed]}).catch(() => null)
        }
        if (!members[0]) return message.reply(`Invalid users ${discord.getEmoji("kannaFacepalm")}`)
        vcunmuteEmbed
        .setAuthor({name: "voice unmute", iconURL: "https://images.assetsdelivery.com/compings_v2/vectorgalaxy/vectorgalaxy1808/vectorgalaxy180807510.jpg"})
        .setTitle(`**Member Voice Unmuted** ${discord.getEmoji("aquaUp")}`)
        .setDescription(`${discord.getEmoji("star")}_Successfully voice unmuted ${members.join(", ")} for reason:_ **${reason}**`)
        message.channel.send({embeds: [vcunmuteEmbed]})
        return
    }
}
