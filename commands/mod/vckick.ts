import {GuildMember, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Kick extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Disconnects users from a voice channel.",
            help:
            `
            \`vckick @user1 @user2 reason?\` - Voice kicks the user(s) with an optional reason
            \`vckick id1 id2 reason?\` - Voice kicks by user id instead of mention
            `,
            examples:
            `
            \`=>vckick @user earrape\`
            `,
            guildOnly: true,
            aliases: ["vcdisconnect"],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        if (!await perms.checkMod()) return
        const vckickEmbed = embeds.createEmbed()
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
            vckickEmbed
            .setAuthor({name: "voice kick", iconURL: "https://cdn1.iconfinder.com/data/icons/interface-filled-blue/32/Microphone_recorder_sound_voice-512.png"})
            .setTitle(`**You Were Voice Kicked** ${discord.getEmoji("tohruSmug")}`)
            .setDescription(`${discord.getEmoji("star")}_You were voice kicked from ${message.guild!.name} for reason:_ **${reason}**`)
            const dm = await member.createDM()
            try {
                await member.voice.disconnect(reason)
                const data = {type: "vckick", user: member.id, executor: message.author.id, date: Date.now(), guild: message.guild?.id, reason, context: message.url}
                discord.emit("caseUpdate", data)
            } catch {
                return message.reply(`I need the **Move Members** permission, or this user is not in a voice channel ${discord.getEmoji("kannaFacepalm")}`)
            }
            await dm.send({embeds: [vckickEmbed]}).catch(() => null)
        }
        if (!members[0]) return message.reply(`Invalid users ${discord.getEmoji("kannaFacepalm")}`)
        vckickEmbed
        .setAuthor({name: "voice kick", iconURL: "https://cdn1.iconfinder.com/data/icons/interface-filled-blue/32/Microphone_recorder_sound_voice-512.png"})
        .setTitle(`**Member Voice Kicked** ${discord.getEmoji("tohruSmug")}`)
        .setDescription(`${discord.getEmoji("star")}_Successfully voice kicked ${members.join(", ")} for reason:_ **${reason}**`)
        message.channel.send({embeds: [vckickEmbed]})
        return
    }
}
