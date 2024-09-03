import {GuildMember, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Unrestrict extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Unrestricts users.",
            help:
            `
            \`unrestrict @user1 @user2 reason?\` - Unrestricts the user(s) with an optional reason
            \`unrestrict id1 id2 reason?\` - Unrestricts by user id instead of mention
            `,
            examples:
            `
            \`=>unrestrict @user shush\`
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
        const sql = new SQLQuery(message)
        const perms = new Permission(discord, message)
        if (!await perms.checkMod()) return
        const restrictEmbed = embeds.createEmbed()
        const restrict = await sql.fetchColumn("special roles", "restricted role")
        if (!restrict) return message.reply("You need to set a restricted role first!")
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
            const member = message.guild!.members.cache.find((m: GuildMember) => m.id === userArray[i]) as GuildMember
            if (!member) continue
            await member.roles.remove(restrict)
            const data = {type: "unrestrict", user: member.id, executor: message.author.id, date: Date.now(), guild: message.guild?.id, reason, context: message.url}
            discord.emit("caseUpdate", data)
            members.push(`<@${member.id}>`)
            const dm = await member.createDM()
            restrictEmbed
            .setAuthor({name: "unrestrict", iconURL: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/mozilla/36/no-entry-sign_1f6ab.png"})
            .setTitle(`**You Were Unrestricted** ${discord.getEmoji("yes")}`)
            .setDescription(`${discord.getEmoji("star")}_You were unrestricted in ${message.guild!.name} for reason:_ **${reason}**`)
            await dm.send({embeds: [restrictEmbed]}).catch(() => null)
        }
        if (!members[0]) return message.reply(`Invalid users ${discord.getEmoji("kannaFacepalm")}`)
        restrictEmbed
        .setAuthor({name: "restrict", iconURL: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/mozilla/36/no-entry-sign_1f6ab.png"})
        .setTitle(`**Member Unrestricted** ${discord.getEmoji("yes")}`)
        .setDescription(`${discord.getEmoji("star")}_Successfully unrestricted ${members.join(", ")} for reason:_ **${reason}**`)
        message.channel.send({embeds: [restrictEmbed]})
        return
    }
}
