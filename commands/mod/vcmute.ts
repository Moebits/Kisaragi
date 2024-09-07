import {GuildMember, Message} from "discord.js"
import {SlashCommandOption} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class VCMute extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Voice mutes a user.",
            help:
            `
            \`vcmute @user1 @user2 reason?\` - Voice mutes the user(s) with an optional reason
            \`vcmute id1 id2 reason?\` - Voice mutes by user id instead of mention
            `,
            examples:
            `
            \`=>vcmute @user earrape\`
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
        const vcmuteEmbed = embeds.createEmbed()
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
            vcmuteEmbed
            .setAuthor({name: "voice mute", iconURL: "https://www.kindpng.com/picc/m/499-4998592_mute-microphone-comments-mute-mic-icon-png-transparent.png"})
            .setTitle(`**You Were Voice Muted** ${discord.getEmoji("vigneDead")}`)
            .setDescription(`${discord.getEmoji("star")}_You were voice muted from ${message.guild!.name} for reason:_ **${reason}**`)
            const dm = await member.createDM()
            try {
                await member.voice.setMute(true, reason)
                const data = {type: "vcmute", user: member.id, executor: message.author.id, date: Date.now(), guild: message.guild?.id, reason, context: message.url}
                discord.emit("caseUpdate", data)
            } catch {
                return message.reply(`I need the **Mute Members** permission, or this user is not in a voice channel ${discord.getEmoji("kannaFacepalm")}`)
            }
            await dm.send({embeds: [vcmuteEmbed]}).catch(() => null)
        }
        if (!members[0]) return message.reply(`Invalid users ${discord.getEmoji("kannaFacepalm")}`)
        vcmuteEmbed
        .setAuthor({name: "voice mute", iconURL: "https://www.kindpng.com/picc/m/499-4998592_mute-microphone-comments-mute-mic-icon-png-transparent.png"})
        .setTitle(`**Member Voice Muted** ${discord.getEmoji("vigneDead")}`)
        .setDescription(`${discord.getEmoji("star")}_Successfully voice muted ${members.join(", ")} for reason:_ **${reason}**`)
        message.channel.send({embeds: [vcmuteEmbed]})
        return
    }
}
