import {GuildMember, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permissions} from "./../../structures/Permissions"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Restrict extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const sql = new SQLQuery(message)
        const perms = new Permissions(discord, message)
        if (await perms.checkMod(message)) return
        const restrictEmbed: any = embeds.createEmbed()
        const restrict = await sql.fetchColumn("special roles", "restricted role")
        if (!restrict) return message.reply("You need to set a restricted role first!")
        const reasonArray: any = []
        const userArray: any = []

        for (let i = 1; i < args.length; i++) {
            if (args[i].match(/\d+/g)) {
                userArray.push(args[i].match(/\d+/g))[0]
            } else {
                reasonArray.push(args[i])
            }
        }

        const reason = reasonArray.join("") ? reasonArray.join(" ") : "None provided!"

        const members: any = []
        for (let i = 0; i < userArray.length; i++) {
            const member = message.guild!.members.find((m: any) => m.id === userArray[i].join("")) as GuildMember
            await member.roles.add(restrict.join(""))
            members.push(`<@${member.id}>`)
            const dm = await member.createDM()
            restrictEmbed
            .setAuthor("restrict", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/mozilla/36/no-entry-sign_1f6ab.png")
            .setTitle(`**You Were Restricted** ${discord.getEmoji("kannaFU")}`)
            .setDescription(`${discord.getEmoji("star")}_You were restricted in ${message.guild!.name} for reason:_ **${reason}**`)
            await dm.send(restrictEmbed)
        }
        restrictEmbed
        .setAuthor("restrict", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/mozilla/36/no-entry-sign_1f6ab.png")
        .setTitle(`**Member Restricted** ${discord.getEmoji("kannaFU")}`)
        .setDescription(`${discord.getEmoji("star")}_Successfully restricted ${members.join(", ")} for reason:_ **${reason}**`)
        message.channel.send(restrictEmbed)
        return
    }
}
